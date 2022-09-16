module.exports.code = (config) => {
    return String.raw`
    
    <html>

<head>
    <style>
        /* 이미지에 캔버스를 겹쳐서 그릴때는 아래 주석 해제 */
        canvas {
            position: absolute;
        }

        video {
            position: absolute;
        }
        div {
            position: relative;
        }
    </style>
</head>

<body>
    <video id="video" width="640" height="480" autoplay muted playsinline></video>
    <canvas id="canvas"></canvas>
    

    <table class="detected"></table>

    <div><button id="captrue-btn">Capture</button></div>
    
    
    <div id="result-div" style="display: none;">
        <p id="motion-result-message"></p>
        <div id="register-btn-bar" align="center">
            <button id="register-btn" class="btn">Register</button> <button id="cancel-btn" class="btn">Cancel</button>
        </div><br>
        <canvas id="capture-canvas" width="480px" height="270px" style="border:1px solid black"></canvas>
        <div id="motion-result-keypoint"></div>
    </div>



    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.2/dist/coco-ssd.min.js"></script>
    

    <script>

        const video = document.getElementById('video');
        const canvas = document.getElementById("canvas");
        const registerBtn = document.getElementById("captrue-btn");
        const context = canvas.getContext("2d");
        let objects = []
        const dataWebSocket = new WebSocket('ws://localhost:1880/ws/data')


        navigator.mediaDevices.getUserMedia({ video: true, audio: false })
            .then(function (stream) {
                video.srcObject = stream;
            });

        cocoSsd.load().then(model => {
            predict();
            function predict() {
                context.drawImage(video, 0, 0);
                model.detect(canvas).then(predictions => {

                    objects = [...predictions]

                    dataWebSocket.send(JSON.stringify({detect : predictions}))
                    canvas.width = video.width;
                    canvas.height = video.height;


                    for (let i = 0; i < predictions.length; i++) {
                        context.beginPath(); // 새로운 경로를 만듭니다. 경로가 생성됬다면, 이후 그리기 명령들은 경로를 구성하고 만드는데 사용하게 됩니다.
                        context.lineWidth = 1;
                        context.strokeStyle = "#2fff00"
                        context.rect(...predictions[i].bbox); // rect(x, y, width, height) 좌측상단이 (x, y)이고 폭과 높이가 width와 height인 직사각형을 그립니다.
                        context.stroke(); // 윤곽선을 이용하여 도형을 그리는 것!
                        context.font = '24px Arial';
                        context.fillStyle = '#2fff00';
                        context.fillText(predictions[i].class + ' ' + parseInt(predictions[i].score * 100) + '%', predictions[i].bbox[0], predictions[i].bbox[1]);

                    }
                });
                requestAnimationFrame(predict);
            }
        });

       registerBtn.addEventListener("click", function(){
            dataWebSocket.send(JSON.stringify({register : predictions}))
       });

    </script>

</body>

</html>
    


    `
}