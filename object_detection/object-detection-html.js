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

    <!-- <div><button id="captrue-btn">Capture</button></div> -->
    
    
    <div id="result-div">
        <p id="detected-result-message"></p>
    </div>



    <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.2/dist/coco-ssd.min.js"></script>
    

    <script>

        let detected = []
        let objects = []
        let data = ""
        let preset = ""

        const video = document.getElementById('video');
        const canvas = document.getElementById("canvas");
        const registerBtn = document.getElementById("captrue-btn");
        const context = canvas.getContext("2d");
        const result = document.getElementById("detected-result-message")
        const dataWebSocket = new WebSocket('${config.dataSocketUrl}')

        function validation(predictions){
            for(i = 0; i < predictions.length; i++){
                if(predictions[i].class === "person"){
                    return true;
                }    
            }
            return false;
        }
        
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
                    
                    if(validation(predictions)){
                        console.log(predictions)
                        dataWebSocket.send(JSON.stringify({detect : predictions}));
                    }

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

        
      

        preset += "<table style='display:inline;margin:0px 5px;'>"
        preset += "<caption>Detected objects</caption>"
        preset += "<tr><th>INDEX</th><th>Objects</th></tr>"
        
        let = detectedCnt = 1;

       setInterval(() => {
        dataWebSocket.send(JSON.stringify({log : objects}))

        objects.forEach((element) => {
            if(!detected.includes(element["class"])){
                detected.push(element["class"]);
                data += "<tr><td>" + detectedCnt + "</td><td>" + element["class"] + "</td></tr>"
                detectedCnt += 1
            }
        });
        console.log("detected : ", detected)
        console.log("objects ", objects)
        detected.forEach((element, idx) => {
            
        })

        result.innerHTML = preset + data;

        
       }, 1000);
    //    registerBtn.addEventListener("click", function(){
    //         dataWebSocket.send(JSON.stringify({register : predictions}))
    //    });

    </script>

</body>

</html>
    `
}