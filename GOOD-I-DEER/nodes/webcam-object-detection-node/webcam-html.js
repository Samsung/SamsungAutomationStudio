module.exports.code = (config) => {
    const html = String.raw;

    const template = html`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>
        <script src="https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js"></script>
        <style>
            body {
                margin: 0;
                padding: 0;
                text-align: center;
            }

            #title {
                margin-top: 20px;
                font-size: 1.5em;
                font-weight: bold;
            }

            #input-video, #output-video{
                 border: 2px solid grey;
                 transform: scaleX(-1);
                 -webkit-transform: scaleX(-1);
            }

            .videoTitle {
                font-weight: 700;
                font-size: 1em;
                margin-bottom: 10px;
            }

        </style>
    </head>
    <body>
        <p id="title">📷 Object Detection 📷</p>
        <div style="display: flex; flex-wrap: wrap; width: 100%; justify-content: space-around">
            <div class="video" style="width: 640px">
                <p class="videoTitle">WebCam</p>
                <video id="input-video" crossorigin="anonymous"  width="640px" height="640px" style="overfit : fill; "></video>
            </div>

            <div class="video" style="width: 640px">
                <p class="videoTitle">Detect Result</p>
                <div style="position: relative;">
                    <video id="output-video" crossorigin="anonymous"  width="640px" height="640px" style="overfit : fill; position: absolute; right: 0; top: 0;" muted="true"></video>
                    <canvas id="output-canvas" width="640px" height="640px" style="position: absolute; right: 0; top: 0;"></canvas>
                </div>
            </div>
        </div>
        <script src="https://cdn.socket.io/4.6.0/socket.io.min.js" integrity="sha384-c79GN5VsunZvi+Q/WObgk2in0CbZsHnjEqvFxC5DxHn9lTfNce2WW6h2pH6u/kF+" crossorigin="anonymous"></script>
        <script type="module">         
            import {YOLO_CLASSES, COLORS} from "../static/constants.js";
            
            const socket = io("${config.socketUrl}:${config.socketPort}");

            const modelName = "${config.model}";
            
            const inputVideo = document.getElementById('input-video');
            const outputVideo = document.getElementById('output-video');

            const videoConstraints = {
                audio: false,
                video: {width: 640, height: 640}
            }

            const canvas = document.getElementById('output-canvas');
            let ctx = canvas.getContext('2d');

            const mapping = new Map();

            YOLO_CLASSES.map((className, classId) => {
                mapping.set(className, classId);
            })

            let model;

            // model load
            async function loadModel() {
                return await ort.InferenceSession.create("../model/" + modelName + ".onnx");
            }

            socket.on("connect", () => {
                navigator.mediaDevices.getUserMedia(videoConstraints)
                .then(async(stream) => {
                    inputVideo.srcObject = stream;
                    outputVideo.srcObject = stream;
                    
                    inputVideo.play();
                    outputVideo.play();
                    
                    model = await loadModel();
                    
                    setInterval(async() => {
                        drawImage(inputVideo);
                        
                        const buffer = getImageBuffer();
                        const boxes = await detectObjectsOnImage(buffer);                                 
                        
                        drawImageAndBoxes(boxes);
                        
                        socket.emit("DetectedObject", boxes);
                    }, 100);
                })
                .catch(err => {
                    console.log(err);
                })
            })

            // draw video object to canvas
            function drawImage(video) {
                ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            }

            // get canvas image pixels
            function getImageBuffer() {
                const imgData = ctx.getImageData(0,0,canvas.width,canvas.height);
                const pixels = imgData.data;
                return pixels;
            }

            function drawImageAndBoxes(boxes) {
                const ctx = canvas.getContext("2d");
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);                 

                for(const [label, values] of Object.entries(boxes)) {
                    const labelIdx = mapping.get(label);

                    ctx.strokeStyle = COLORS[labelIdx];
                    ctx.lineWidth = 5;
                    ctx.font = "bold 20px Arial";
                    const width = ctx.measureText(label).width;
                    
                    values.forEach((detectedObj) => {
                        ctx.fillStyle = COLORS[labelIdx];
                        ctx.strokeRect(640 - (detectedObj.w + detectedObj.x), detectedObj.y, detectedObj.w, detectedObj.h);
    
                        ctx.fillRect(640 - (detectedObj.w + detectedObj.x), detectedObj.y, width + 90, 30);
                        ctx.fillStyle = "#ffffff";
                        ctx.fillText(label + " - " + ((detectedObj.prob * 100).toFixed(1)) + "%", 640 - (detectedObj.w + detectedObj.x) + 2, detectedObj.y + 22);
                    });
                }
            }

            async function detectObjectsOnImage(buf) {
                const [input, width, height] = await prepareInput(buf);
                const output = await runModel(input);
                const boxes = processOutput(output, width, height);
                return getDetectedObjects(boxes);
            }
        
            async function prepareInput(buf) {
                return new Promise(resolve => {
                    const red = [];
                    const green = [];
                    const blue = [];

                    for(let i = 0; i < buf.length; i += 4){
                        red.push(buf[i] / 255.0);
                        green.push(buf[i + 1] / 255.0);
                        blue.push(buf[i + 2] / 255.0);
                    }

                    const input = [...red, ...green, ...blue];

                    resolve([input, canvas.width, canvas.height])
                });
            }
           
            async function runModel(input) {
                input = new ort.Tensor(Float32Array.from(input), [1, 3, 640, 640]);
                const outputs = await model.run({images : input});
                return outputs["output0"].data;
            }

           function processOutput(output, width, height) {
                let boxes = [];

                for (let index = 0; index < 8400; index++) {
                    const [classId, prob] = [...Array(80).keys()]
                        .map(col => [col, output[8400 * (col + 4) + index]])
                        .reduce((accum, item) => item[1] > accum[1] ? item : accum, [0, 0]);

                    if (prob < ${config.threshold}) {
                        continue;
                    }

                    const label = YOLO_CLASSES[classId];
                    const xc = output[index];
                    const yc = output[8400 + index];
                    const w = output[2 * 8400 + index];
                    const h = output[3 * 8400 + index];
                    const x1 = (xc - w / 2) / 640 * width;
                    const y1 = (yc - h / 2) / 640 * height;
                    const x2 = (xc + w / 2) / 640 * width;
                    const y2 = (yc + h / 2) / 640 * height;
                    boxes.push([x1, y1, x2, y2, label, prob]);
                }
  
                boxes = boxes.sort((box1, box2) => box2[5] - box1[5])

                const result = [];

                while (boxes.length > 0) {
                    result.push(boxes[0]);
                    boxes = boxes.filter(box => iou(boxes[0], box) < 0.7);
                }

                return result;
            }

            function getDetectedObjects(boxes) {
                const result = {};

                boxes.forEach((box) => {
                  const [x1, y1, x2, y2, label, prob] = box;
                  
                  const info = {
                    x: x1,
                    y: y1,
                    w: x2 - x1,
                    h: y2 - y1,
                    prob: prob,
                  };
    
                  if(!result[label]) {
                     result[label] = [];
                  }

                  result[label].push(info);
                });
                
                return result;
            }

           function iou(box1, box2) {
                return intersection(box1, box2) / union(box1, box2);
            }

           function union(box1, box2) {
                const [box1_x1, box1_y1, box1_x2, box1_y2] = box1;
                const [box2_x1, box2_y1, box2_x2, box2_y2] = box2;
                const box1_area = (box1_x2 - box1_x1) * (box1_y2 - box1_y1);
                const box2_area = (box2_x2 - box2_x1) * (box2_y2 - box2_y1);
                return box1_area + box2_area - intersection(box1,box2);
            }

           function intersection(box1, box2) {
                const [box1_x1, box1_y1, box1_x2, box1_y2] = box1;
                const [box2_x1, box2_y1, box2_x2, box2_y2] = box2;

                const x1 = Math.max(box1_x1, box2_x1);
                const y1 = Math.max(box1_y1, box2_y1);
                const x2 = Math.min(box1_x2, box2_x2);
                const y2 = Math.min(box1_y2, box2_y2);

                return (x2 - x1) * (y2 - y1);
            }
        </script>
    </body>
    </html>
    `;

    return template;
  }