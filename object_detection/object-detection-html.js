module.exports.code = (config) => {
    return String.raw`
    <html>

    <head>
        <style>
    
            h2 {
                margin-top: 15px;
                margin-right: auto;
                margin-left: auto;
                text-align: center;
            }
    
            #regi-form {
                margin-top: 0%;
            }
    
            #frame > video {
                position: absolute;
                border: 8px solid rgb(15, 195, 39);
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
    
            #frame>canvas {
                position: absolute;
                border: 1px solid gray;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
            }
        </style>
    </head>
    
    <body>
    
        <div id="title">
            <h2>Object detection display</h2>
        </div>
    
        <div style="min-height: 800px;">
            <div id="frame">
                <video id="video" width="640" height="480" autoplay muted playsinline></video>
                <canvas id="canvas"></canvas>
            </div>
    
            <div id="detected-result-message">
                <h3 style='text-align: left; margin : 0px; '>Detected objects</h3></br>
                <h4>INDEX Objects register</h4>
                <form action="" id="regi-form">
                </form>
                <button id="captrue-btn">register</button>
                <!-- Garo start -->
                <div>
                    <button id="pose-object-btn">pose-object mapping</button>
                    <div id="pose-object-mapping">
    
                    </div>
                    <button id="pose-object-mapping-btn" style="display:none;">regist</button>
                </div>
                <!-- Garo end -->
            </div>
        </div>
    
    
        <div align="center" style="min-height: 100px;">
            <br>
            <a href="https://github.com/5FNSaaS">
                <img style="width:15px"
                    src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMjU2IDBjLTE0MC42MDkzNzUgMC0yNTYgMTE1LjM5MDYyNS0yNTYgMjU2IDAgMTE5Ljk4ODI4MSA4NC4xOTUzMTIgMjI4Ljk4NDM3NSAxOTYgMjU2di04NC42OTUzMTJjLTExLjA3ODEyNSAyLjQyNTc4MS0yMS4yNzM0MzggMi40OTYwOTMtMzIuNTUwNzgxLS44MjgxMjYtMTUuMTI4OTA3LTQuNDY0ODQzLTI3LjQyMTg3NS0xNC41NDI5NjgtMzYuNTQ2ODc1LTI5LjkxMDE1Ni01LjgxNjQwNi05LjgxMjUtMTYuMTI1LTIwLjQ1MzEyNS0yNi44Nzg5MDYtMTkuNjcxODc1bC0yLjYzNjcxOS0yOS44ODI4MTJjMjMuMjUzOTA2LTEuOTkyMTg4IDQzLjM3MTA5MyAxNC4xNjc5NjkgNTUuMzEyNSAzNC4yMzA0NjkgNS4zMDQ2ODcgOC45MjE4NzQgMTEuNDEwMTU2IDE0LjE1MjM0MyAxOS4yNDYwOTMgMTYuNDY0ODQzIDcuNTc0MjE5IDIuMjMwNDY5IDE1LjcwNzAzMiAxLjE2MDE1NyAyNS4xODM1OTQtMi4xODc1IDIuMzc4OTA2LTE4Ljk3MjY1NiAxMS4wNzAzMTMtMjYuMDc0MjE5IDE3LjYzNjcxOS0zNi4wNzQyMTl2LS4wMTU2MjRjLTY2LjY3OTY4Ny05Ljk0NTMxMy05My4yNTM5MDYtNDUuMzIwMzEzLTEwMy44MDA3ODEtNzMuMjQyMTg4LTEzLjk3NjU2My0zNy4wNzQyMTktNi40NzY1NjMtODMuMzkwNjI1IDE4LjIzODI4MS0xMTIuNjYwMTU2LjQ4MDQ2OS0uNTcwMzEzIDEuMzQ3NjU2LTIuMDYyNSAxLjAxMTcxOS0zLjEwNTQ2OS0xMS4zMzIwMzItMzQuMjMwNDY5IDIuNDc2NTYyLTYyLjU0Njg3NSAyLjk4NDM3NS02NS41NTA3ODEgMTMuMDc4MTI1IDMuODY3MTg3IDE1LjIwMzEyNS0zLjg5MDYyNSA1Ni44MDg1OTMgMjEuMzg2NzE4bDcuMTkxNDA3IDQuMzIwMzEzYzMuMDA3ODEyIDEuNzkyOTY5IDIuMDYyNS43Njk1MzEgNS4wNzAzMTIuNTQyOTY5IDE3LjM3MTA5NC00LjcxODc1IDM1LjY4MzU5NC03LjMyNDIxOSA1My43MjY1NjMtNy41NTg1OTQgMTguMTc5Njg3LjIzNDM3NSAzNi4zNzUgMi44Mzk4NDQgNTQuNDY0ODQ0IDcuNzVsMi4zMjgxMjQuMjM0Mzc1Yy0uMjAzMTI0LS4wMzEyNS42MzI4MTMtLjE0ODQzNyAyLjAzNTE1Ny0uOTg0Mzc1IDUxLjk3MjY1Ni0zMS40ODA0NjkgNTAuMTA1NDY5LTIxLjE5MTQwNiA2NC4wNDI5NjktMjUuNzIyNjU2LjUwMzkwNiAzLjAwNzgxMiAxNC4xMjg5MDYgMzEuNzg1MTU2IDIuOTE3OTY4IDY1LjU4MjAzMS0xLjUxMTcxOCA0LjY1NjI1IDQ1LjA1ODU5NCA0Ny4zMDA3ODEgMTkuMjQ2MDk0IDExNS43NTM5MDYtMTAuNTQ2ODc1IDI3LjkzMzU5NC0zNy4xMTcxODggNjMuMzA4NTk0LTEwMy43OTY4NzUgNzMuMjUzOTA3di4wMTU2MjRjOC41NDY4NzUgMTMuMDI3MzQ0IDE4LjgxNjQwNiAxOS45NTcwMzIgMTguNzYxNzE5IDQ2LjgzMjAzMnYxMDUuNzIyNjU2YzExMS44MDg1OTQtMjcuMDE1NjI1IDE5Ni0xMzYuMDExNzE5IDE5Ni0yNTYgLjAwMzkwNi0xNDAuNjA5Mzc1LTExNS4zODY3MTktMjU2LTI1NS45OTYwOTQtMjU2em0wIDAiLz48L3N2Zz4=" />
                D5MI
            </a> |
            <a href="https://github.com/rootkwak528">Seunghoon Park</a> | <a href="https://github.com/eona1301">Youngjin
                Choi</a>
            | <a href="https://github.com/whgusalsdl">Juseong Hong</a> | <a href="https://github.com/483759">Sangwoo Han</a>
            |
            <a href="https://github.com/steven9408">Donghyun Han</a> | <a href="https://github.com/steven9408">Yongwoong
                Kim</a><br>
        </div>
    
    
        
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.11.0/dist/tf.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd@2.2.2/dist/coco-ssd.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.2/dist/js/bootstrap.bundle.min.js"
            integrity="sha384-MrcW6ZMFYlzcLA8Nl+NtUVF0sA7MsXsP1UyJoMp4YLEuNSfAP+JcXn/tWtIaxVXM"
            crossorigin="anonymous"></script>
        <script src="https://code.jquery.com/jquery-1.12.4.js"></script>
    
        <script>
        
    
            let detected = []
            let objects = []
            let data = ""
            let preset = ""
            let savedObjects = []
            let registered = "${config.registered}".split(',');
            let = detectedCnt = 1;
            let database;
    
            const video = document.getElementById('video');
            const canvas = document.getElementById("canvas");
            const registerBtn = document.getElementById("captrue-btn");
            const context = canvas.getContext("2d");
            const result = document.getElementById("detected-result-message")
            const registerWebSocket = new WebSocket("${config.registerSocketUrl}")
            const dataWebSocket = new WebSocket("${config.dataSocketUrl}")
            const _form = document.getElementById("regi-form")
    
    
                     
            // garo start
            
            let savedPose = [{ name: 'seat' }, { name: 'armup' }]
            let savedObject = [{ name: 'person' }, { name: 'chair' }, { name: 'cellphone' }, { name: 'cup' }]
            document.getElementById('pose-object-btn').addEventListener('click', () => {
                let area = document.getElementById('pose-object-mapping')
                let html = ${"`"}<select name="pose" id="pose">
                            <option value="null" selected>null</option>${"`"}
    
                savedPose.forEach(pose => {
                    html += ${"`"}<option value="${"`"} + pose.name + ${"`"}">${"`"} + pose.name + ${"`"}</option>${"`"}
                })
    
                html += ${"`"}</select>
                        <select name="object" id="object">
                        <option value="null" selected>null</option>${"`"}
    
                savedObject.forEach(object => {
                    html += ${"`"}<option value="${"`"} + object.name + ${"`"}">${"`"} + object.name + ${"`"}</option>${"`"}
                })
                html += ${"`"} </select>
                <input type="text" id="pose-object-name">
                ${"`"}
    
                area.innerHTML = html
    
                document.getElementById('pose-object-mapping-btn').setAttribute('style', '')
            })
    
            document.getElementById('pose-object-mapping-btn').addEventListener('click', () => {
                let nodes = document.getElementById('pose-object-mapping').children
                let pose = getVal(nodes.pose);
                let object = getVal(nodes.object);
                let value = document.getElementById('pose-object-name').value
    
                function getVal(node) {
                    let res;
                    for (let i = 0; i < node.options.length; i++) {
                        if (node.options[i].selected == true) {
                            res = node.options[i].value;
                        }
                    }
                    return res
                }
                console.log({ pose, object, value });
                registerWebSocket.send(JSON.stringify({ dataType : "command", data : {pose, object, value} }));
            })
    
            
            // garo end
             
    
            function validation(predictions) {
                for (i = 0; i < predictions.length; i++) {
                    if (predictions[i].class === "person") {
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
    
    
    
    
                        if (validation(predictions)) {
                            dataWebSocket.send(JSON.stringify({ dataType : "object", data : predictions }));
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
                            context.fillRect(predictions[i].bbox[0] + predictions[i].bbox[2] / 2 - 1, predictions[i].bbox[1] + predictions[i].bbox[3] / 2 - 1, 2, 2);
                        }
                    });
                    requestAnimationFrame(predict);
                }
            });
    
            const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
           
           setInterval(() => {
           
           var curr = new Date();
           const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
           dataWebSocket.send(JSON.stringify({log : {data : objects, date : new Date(utc + (KR_TIME_DIFF))}}))
            
                objects.forEach((element) => {
                    if (!detected.includes(element["class"])) {
                        detected.push(element["class"]);
    
                        let tmpNode = document.createElement('div');
                        let tmpSpan = document.createElement('span');
                        let tmpInput = document.createElement('input');
                        let tmpString = document.createTextNode(detectedCnt + " " + element["class"]);
    
                        //tmpNode.style.cssText = "display : flex; justify-content: left; margin-top : .25rem; margin-bottom : .25rem;"
                        tmpInput.type = "checkbox"
                        tmpInput.id = element["class"]
                        tmpInput.value = element["class"]
                        tmpInput.checked = registered.includes(element["class"])
    
                        tmpSpan.appendChild(tmpString);
                        tmpNode.appendChild(tmpSpan);
                        tmpNode.appendChild(tmpInput);
    
                        _form.insertAdjacentElement('beforeend', tmpNode);
                        detectedCnt += 1
                    }
                });
            },
                1000);
    
            registerBtn.addEventListener("click", function(){
    
                registerWebSocket.send(JSON.stringify(
                    { dataType : "object", data : 
                    detected.filter((element) => {
                    return document.getElementById(element).checked})}
                    ));
            });
    
        </script>
    
    </body>
    
    </html>
    `
}