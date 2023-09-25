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
                margin-bottom: 20px;
                font-size: 1.5em;
                font-weight: bold;
            }

            #input-video, #output-video{
                 border: 2px solid grey;
                 transform: scaleX(-1);
                 -webkit-transform: scaleX(-1);
            }

        </style>
    </head>
    <body>
        <p id="title">📷 Object Detection 📷</p>
        <div style="display: flex; flex-wrap: wrap;">
            <div class="video" style="width: 640px">
                <h4>WebCam</h4>
                <video id="input-video" crossorigin="anonymous"  width="640px" height="640px" style="overfit : fill; "></video>
            </div>

            <div class="video" style="width: 640px">
                <h4>Detect Result</h4>
                <div style="position: relative;">
                    <video id="output-video" crossorigin="anonymous"  width="640px" height="640px" style="overfit : fill; position: absolute; right: 0; top: 0;" muted="true"></video>
                    <canvas id="output-canvas" width="640px" height="640px" style="position: absolute; right: 0; top: 0;"></canvas>
                </div>
            </div>
        </div>

        <script src="/socket.io/socket.io.js"></script>
        <script type="module"> 
            let ws = new WebSocket("${config.socketUrl}");
            // let socket = io.connect("${config.socketUrl}");
            
        

            const modelName = "${config.model}";

            const videoElement = document.getElementById('input-video');
            
            const videoConstraints = {
                audio: false,
                video: {width: 640, height: 640}
            }

            const videoElement2 = document.getElementById('output-video');

            const canvasElement = document.getElementById('output-canvas');
            let ctx = canvasElement.getContext('2d');

            let model;

            // model load
            async function loadModel() {
                return await ort.InferenceSession.create("../model/" + modelName + ".onnx");
            }

            navigator.mediaDevices.getUserMedia(videoConstraints)
            .then(async(stream) => {
                videoElement.srcObject = stream;
                videoElement2.srcObject = stream;
                
                model = await loadModel();

                videoElement.play();
                
                videoElement2.play();
                
                setInterval(async()=>{
                    drawImage(videoElement);

                    const buffer = getBuffer();
                    const boxes = await detect_objects_on_image(buffer);
                    
                    if(ws.OPEN){
                        let msg = {
                            payload: boxes,
                        };
                        ws.send(JSON.stringify(msg));
                    }

                    draw_image_and_boxes(boxes);
                }, 100);
            })
            .catch(err => {
                console.log(err);
            })

            // draw video object to canvas
            function drawImage(video) {
                ctx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            }

            // get pixels
            function getBuffer() {
                const imgData = ctx.getImageData(0,0,canvasElement.width,canvasElement.height);
                const pixels = imgData.data;
                
                return pixels;
            }


            function draw_image_and_boxes(boxes) {
                const ctx = canvasElement.getContext("2d");
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);                 

                boxes.forEach(([x1, y1, x2, y2, label, idx, prob]) => {
                    ctx.strokeStyle = colors[idx];
                    ctx.lineWidth = 5;
                    ctx.font = "bold 20px Arial";
                    
                    ctx.strokeRect(640 - x2, y1, x2-x1, y2-y1);
                    ctx.fillStyle = colors[idx];
                    const width = ctx.measureText(label).width;

                    ctx.fillRect(640 - x2, y1, width + 90, 30);
                    ctx.fillStyle = "#ffffff";
                    ctx.fillText(label + " - " + ((prob * 100).toFixed(1)) + "%", 640 - x2 + 2, y1 + 22);
                });
                
                
            }

           async function detect_objects_on_image(buf) {
                const [input,img_width,img_height] = await prepare_input(buf);
                const output = await run_model(input);
                return process_output(output,img_width,img_height);
            }
        
           async function prepare_input(buf) {
                return new Promise(resolve => {
                   
                    const red = [];
                    const green = [];
                    const blue = [];

                    for(let i = 0; i < buf.length; i += 4){
                        red.push(buf[i] / 255.0);
                        green.push(buf[i+1] / 255.0);
                        blue.push(buf[i+2] / 255.0);
                    }

                    const input = [...red, ...green, ...blue];

                    resolve([input, canvasElement.width, canvasElement.height])
                });
           }
           
           async function run_model(input) {
                input = new ort.Tensor(Float32Array.from(input),[1, 3, 640, 640]);
                const outputs = await model.run({images:input});
                return outputs["output0"].data;
            }

           function process_output(output, img_width, img_height) {
                let boxes = [];
                for (let index = 0; index < 8400; index++) {
                    const [class_id,prob] = [...Array(80).keys()]
                        .map(col => [col, output[8400 * (col + 4) + index]])
                        .reduce((accum, item) => item[1] > accum[1] ? item : accum, [0, 0]);
                    if (prob < ${config.threshold}) {
                        continue;
                    }
                    const label = yolo_classes[class_id];
                    const xc = output[index];
                    const yc = output[8400 + index];
                    const w = output[2 * 8400 + index];
                    const h = output[3 * 8400 + index];
                    const x1 = (xc - w / 2) / 640 * img_width;
                    const y1 = (yc - h / 2) / 640 * img_height;
                    const x2 = (xc + w / 2) / 640 * img_width;
                    const y2 = (yc + h / 2) / 640 * img_height;
                    boxes.push([x1, y1, x2, y2, label, class_id, prob]);
                }
  
                boxes = boxes.sort((box1,box2) => box2[5]-box1[5])
                const result = [];
                while (boxes.length > 0) {
                    result.push(boxes[0]);
                    boxes = boxes.filter(box => iou(boxes[0], box) < 0.7);
                }
                return result;
            }

           function iou(box1,box2) {
                return intersection(box1,box2)/union(box1,box2);
            }

           function union(box1,box2) {
                const [box1_x1,box1_y1,box1_x2,box1_y2] = box1;
                const [box2_x1,box2_y1,box2_x2,box2_y2] = box2;
                const box1_area = (box1_x2-box1_x1)*(box1_y2-box1_y1)
                const box2_area = (box2_x2-box2_x1)*(box2_y2-box2_y1)
                return box1_area + box2_area - intersection(box1,box2)
            }

           function intersection(box1,box2) {
                const [box1_x1,box1_y1,box1_x2,box1_y2] = box1;
                const [box2_x1,box2_y1,box2_x2,box2_y2] = box2;
                const x1 = Math.max(box1_x1,box2_x1);
                const y1 = Math.max(box1_y1,box2_y1);
                const x2 = Math.min(box1_x2,box2_x2);
                const y2 = Math.min(box1_y2,box2_y2);
                return (x2-x1)*(y2-y1)
            }

           const yolo_classes = [
               'person', 'bicycle', 'car', 'motorcycle', 'airplane', 'bus', 'train', 'truck', 'boat',
               'traffic light', 'fire hydrant', 'stop sign', 'parking meter', 'bench', 'bird', 'cat', 'dog', 'horse',
               'sheep', 'cow', 'elephant', 'bear', 'zebra', 'giraffe', 'backpack', 'umbrella', 'handbag', 'tie', 'suitcase',
               'frisbee', 'skis', 'snowboard', 'sports ball', 'kite', 'baseball bat', 'baseball glove', 'skateboard',
               'surfboard', 'tennis racket', 'bottle', 'wine glass', 'cup', 'fork', 'knife', 'spoon', 'bowl', 'banana', 'apple',
               'sandwich', 'orange', 'broccoli', 'carrot', 'hot dog', 'pizza', 'donut', 'cake', 'chair', 'couch', 'potted plant',
               'bed', 'dining table', 'toilet', 'tv', 'laptop', 'mouse', 'remote', 'keyboard', 'cell phone', 'microwave', 'oven',
               'toaster', 'sink', 'refrigerator', 'book', 'clock', 'vase', 'scissors', 'teddy bear', 'hair drier', 'toothbrush'
           ];

           const colors = ['#2ac53c', '#8529cd', '#0ba70a', '#60a317', '#9613ed', '#e71789', '#6b5330', '#b6ad58', '#be4089', '#afd3ab', 
                            '#06314e', '#e3f43b', '#bc9ea9', '#09664f', '#bb8582', '#1c45f1', '#16f2c7', '#16fa6f', '#b23f67', '#56a7ef', 
                            '#333092', '#111633', '#c093b1', '#14088d', '#81a73e', '#b7f799', '#5ebb7a', '#bb06e4', '#c83007', '#cdecf6', 
                            '#e9f481', '#4b000f', '#552fa8', '#60e96e', '#e80c38', '#408c52', '#8602ba', '#579f39', '#fe0229', '#3183ab', 
                            '#293164', '#07f8bb', '#805ae2', '#c9de39', '#60dcee', '#9c9c9e', '#5ace32', '#b30d4a', '#f87005', '#a7ee4a', 
                            '#166aa1', '#122c47', '#dfd002', '#30b006', '#0cd484', '#d24ea1', '#6acc19', '#7c30dd', '#7d13ba', '#b8ad87', 
                            '#4a39a4', '#588fdf', '#a5dba2', '#e8f76d', '#f049e7', '#528fa0', '#c32535', '#80ab5d', '#e6f322', '#d4af25', 
                            '#19783e', '#ff5fdf', '#69c83e', '#8c5ac6', '#503754', '#2481fb', '#c91d51', '#0dac54', '#503df1', '#2d2320'
                        ]

        </script>
    </body>
    </html>
    `;

    return template;
  }