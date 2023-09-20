module.exports.code = (config) => {
    const html = String.raw;

    const template = html`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Document</title>

        <style>
            #input-video {
                border: 2px solid grey;
                transform: scaleX(-1);
                -webkit-transform: scaleX(-1);
                // display: none;
            }

            #output-canvas {
                border: 3px solid grey;
                transform: scaleX(-1);
                -webkit-transform: scaleX(-1);
            }
        </style>
    </head>
    <body>
        <h1>📷 Object Detection 📷</h1>
        <h1>${config.socketUrl}</h1>
        <div>
            <h5>WebCam</h5>
            <video id="input-video" crossorigin="anonymous"  width="600px" height="340px"></video>
        </div>

        <div>
            <h5>Detect Result</h5>
            <canvas id="output-canvas" width="600px" height="340px"></canvas>
        </div>


        <script type="module">
            
            // video로 웹캠 연결
            const videoElement = document.getElementById('input-video');
            const videoConstraints = {
                audio: false,
                video: {width: 1280, height: 720}
            }

            navigator.mediaDevices.getUserMedia(videoConstraints)
            .then(stream => {
                videoElement.srcObject = stream;
                videoElement.oncanplay = function (e) {
                    videoElement.play();
                }
            })
            .catch(err => {
                console.log(err)
            })

            // canva로 웹캠 연결
            const canvasElement = document.getElementById('output-canvas');
            let ctx = canvasElement.getContext('2d');

            let canvasInterval = null;
            let fps = 60;

            function drawImage(video) {
                ctx.drawImage(video, 0, 0, canvasElement.width, canvasElement.height);
            }

            canvasInterval = window.setInterval(()=>{
                drawImage(videoElement);
            }, 1000 / fps);
            


        </script>
    </body>
    </html>
    `;

    return template;
  }