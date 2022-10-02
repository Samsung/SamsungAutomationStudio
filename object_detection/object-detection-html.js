module.exports.code = (config) => {
    return String.raw`
    <html>

    <head>
        <style>
            body, html {
                overflow-x: hidden;
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
    
            #app {
                width: auto;
                background-color: rgb(240, 240, 240);
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 30px;
                padding-top: 3%;
            }
    
            #title {
                margin-bottom: 20px;
                font-size: 32px;
                font-weight: 900;
            }
    
            #main {
                display: flex;
                justify-content: space-between;
                gap: 10px;
                width: 80%;
            }
    
            #frame {
                width: 60%;
            }
    
            #frame > #video {
                width: 640px;
                aspect-ratio: 4/3;
                box-sizing: border-box;
                border: 8px solid rgb(15, 195, 39);
            }
    
            #frame>canvas {
                position: absolute;
                left: 10%;
            }
    
            #detected-result-section {
                width: 30%;
                background-color: white;
                border: 1px solid black;
                border-radius: 10px;
                padding: 10px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
            }
    
            #detected-objects {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
    
            .sub-title {
                font-size: 20px;
                font-weight: bold;
                padding: 10px;
            }
    
            #detected-objects-table {
                width: 100%;
            }
    
            #detected-objects-table th, td {
                padding: 5px;
                text-align: center;
            }
    
            .sub-btn {
                display: flex;
                justify-content: center;
                background-color: rgb(153, 0, 0);
                width: 100%;
                padding: 8px 0;
                margin: 8px 0;
                border-radius: 5px;
                color: white;
            }
    
            .sub-btn:hover {
                cursor: pointer;
            }
    
            #pose-object-register {
                display: flex;
                flex-direction: column;
                align-items: center;
            }
    
            #pose-object-mapping select {
                width: 100%;
            }
    
            #pose-object-mapping td {
                text-align: right;
            }
    
            #footer {
                width: 100%;
                padding: 30px;
                display: flex;
                justify-content: center;
                gap: 10px;
                background-color: white;
            }
    
            #footer a {
                color: black;
                text-decoration: none;
            }
    
            #footer a:visited {
                color: black;
            }
        </style>
    </head>
    
    <body>
        <div id="app">
            <header id="title">OBJECT DETECTION DISPLAY <button id="test-btn">click!</button></header>
            <div id="main">
                <section id="frame">
                    <video id="video" width="640" height="480" autoplay muted playsinline></video>
                    <canvas id="canvas"></canvas>
                    
                </section>
        
                <section id="detected-result-section">
                    <article id="detected-objects">
                        <div class="sub-title">Detected Objects</div>
                        <table id="detected-objects-table">
                            <th>INDEX</th>
                            <th>OBJECTS</th>
                            <th>REGISTER</th>
                        </table>
                        <div class="sub-btn" id="capture-btn">REGISTER</div>
                    </article>
                    
                    <article id="pose-object-register">
                        <div class="sub-title">Pose Object Register</div>
                        <table id="pose-object-mapping">
                            <tr id="name-row">
                                <td id="name-title">Name</td>
                                <td>
                                    <input type="text" id="pose-object-name">
                                </td>
                            </tr>
                            <tr id="pose-row">
                                <td id="pose-title">Pose</td>
                                <td>
                                    <select name="pose" id="pose">
                                        <option value="null" selected>-</option>
                                    </select>
                                </td>
                            </tr>
                            <tr id="object-row">
                                <td id="object-title">Object</td>
                                <td>
                                    <select name="object" id="object">
                                        <option value="null" selected>-</option>
                                    </select>
                                </td>
                            </tr>
                        </table>
                        <div class="sub-btn" id="pose-object-mapping-btn">REGISTER</div>
                        
                    </article>
                </section>
            </div>
        
            <footer id="footer">
                <a href="https://github.com/5FNSaaS">
                    <img style="width:15px"
                        src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMjU2IDBjLTE0MC42MDkzNzUgMC0yNTYgMTE1LjM5MDYyNS0yNTYgMjU2IDAgMTE5Ljk4ODI4MSA4NC4xOTUzMTIgMjI4Ljk4NDM3NSAxOTYgMjU2di04NC42OTUzMTJjLTExLjA3ODEyNSAyLjQyNTc4MS0yMS4yNzM0MzggMi40OTYwOTMtMzIuNTUwNzgxLS44MjgxMjYtMTUuMTI4OTA3LTQuNDY0ODQzLTI3LjQyMTg3NS0xNC41NDI5NjgtMzYuNTQ2ODc1LTI5LjkxMDE1Ni01LjgxNjQwNi05LjgxMjUtMTYuMTI1LTIwLjQ1MzEyNS0yNi44Nzg5MDYtMTkuNjcxODc1bC0yLjYzNjcxOS0yOS44ODI4MTJjMjMuMjUzOTA2LTEuOTkyMTg4IDQzLjM3MTA5MyAxNC4xNjc5NjkgNTUuMzEyNSAzNC4yMzA0NjkgNS4zMDQ2ODcgOC45MjE4NzQgMTEuNDEwMTU2IDE0LjE1MjM0MyAxOS4yNDYwOTMgMTYuNDY0ODQzIDcuNTc0MjE5IDIuMjMwNDY5IDE1LjcwNzAzMiAxLjE2MDE1NyAyNS4xODM1OTQtMi4xODc1IDIuMzc4OTA2LTE4Ljk3MjY1NiAxMS4wNzAzMTMtMjYuMDc0MjE5IDE3LjYzNjcxOS0zNi4wNzQyMTl2LS4wMTU2MjRjLTY2LjY3OTY4Ny05Ljk0NTMxMy05My4yNTM5MDYtNDUuMzIwMzEzLTEwMy44MDA3ODEtNzMuMjQyMTg4LTEzLjk3NjU2My0zNy4wNzQyMTktNi40NzY1NjMtODMuMzkwNjI1IDE4LjIzODI4MS0xMTIuNjYwMTU2LjQ4MDQ2OS0uNTcwMzEzIDEuMzQ3NjU2LTIuMDYyNSAxLjAxMTcxOS0zLjEwNTQ2OS0xMS4zMzIwMzItMzQuMjMwNDY5IDIuNDc2NTYyLTYyLjU0Njg3NSAyLjk4NDM3NS02NS41NTA3ODEgMTMuMDc4MTI1IDMuODY3MTg3IDE1LjIwMzEyNS0zLjg5MDYyNSA1Ni44MDg1OTMgMjEuMzg2NzE4bDcuMTkxNDA3IDQuMzIwMzEzYzMuMDA3ODEyIDEuNzkyOTY5IDIuMDYyNS43Njk1MzEgNS4wNzAzMTIuNTQyOTY5IDE3LjM3MTA5NC00LjcxODc1IDM1LjY4MzU5NC03LjMyNDIxOSA1My43MjY1NjMtNy41NTg1OTQgMTguMTc5Njg3LjIzNDM3NSAzNi4zNzUgMi44Mzk4NDQgNTQuNDY0ODQ0IDcuNzVsMi4zMjgxMjQuMjM0Mzc1Yy0uMjAzMTI0LS4wMzEyNS42MzI4MTMtLjE0ODQzNyAyLjAzNTE1Ny0uOTg0Mzc1IDUxLjk3MjY1Ni0zMS40ODA0NjkgNTAuMTA1NDY5LTIxLjE5MTQwNiA2NC4wNDI5NjktMjUuNzIyNjU2LjUwMzkwNiAzLjAwNzgxMiAxNC4xMjg5MDYgMzEuNzg1MTU2IDIuOTE3OTY4IDY1LjU4MjAzMS0xLjUxMTcxOCA0LjY1NjI1IDQ1LjA1ODU5NCA0Ny4zMDA3ODEgMTkuMjQ2MDk0IDExNS43NTM5MDYtMTAuNTQ2ODc1IDI3LjkzMzU5NC0zNy4xMTcxODggNjMuMzA4NTk0LTEwMy43OTY4NzUgNzMuMjUzOTA3di4wMTU2MjRjOC41NDY4NzUgMTMuMDI3MzQ0IDE4LjgxNjQwNiAxOS45NTcwMzIgMTguNzYxNzE5IDQ2LjgzMjAzMnYxMDUuNzIyNjU2YzExMS44MDg1OTQtMjcuMDE1NjI1IDE5Ni0xMzYuMDExNzE5IDE5Ni0yNTYgLjAwMzkwNi0xNDAuNjA5Mzc1LTExNS4zODY3MTktMjU2LTI1NS45OTYwOTQtMjU2em0wIDAiLz48L3N2Zz4=" />
                    D5MI
                </a> |
                <a href="https://github.com/Orchemi">Seunghun Park</a> | <a href="https://github.com/eona1301">Youngjin
                    Choi</a>
                | <a href="https://github.com/whgusalsdl">Juseong Hong</a> | <a href="https://github.com/483759">Sangwoo Han</a>
                |
                <a href="https://github.com/steven9408">Donghyun Han</a> | <a href="https://github.com/steven9408">Yongwoong
                    Kim</a><br>
            </footer>
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
            let registeredPose = "${config.registeredPose}".split(',');
            let = detectedCnt = 1;
            let database;
    
            const video = document.getElementById('video');
            const canvas = document.getElementById("canvas");
            const registerBtn = document.getElementById("capture-btn");
            const context = canvas.getContext("2d");
            const result = document.getElementById("detected-result-section")
            const registerWebSocket = new WebSocket("${config.registerSocketUrl}")
            const dataWebSocket = new WebSocket("${config.dataSocketUrl}")
            //const registerWebSocket = new WebSocket("ws://localhost:1880/ws/register")
            //const dataWebSocket = new WebSocket("ws://localhost:1880/ws/data")
            const registerResultTable = document.getElementById("detected-objects-table");
            
            const testBtn = document.getElementById("test-btn");
            testBtn.addEventListener("click", function(){
                console.log(registeredPose);
                console.log(registered);
            })



            let savedPose = registeredPose
            let savedObject = registered
            
            let poseDropdown = document.getElementById('pose');
            let objectDropdown = document.getElementById('object');
            
            savedPose.forEach(pose => {;
                let tmp = document.createElement('option');
                tmp.value = pose
                tmp.innerText = pose
                poseDropdown.appendChild(tmp);
            })

            savedObject.forEach(object => {;
                let tmp = document.createElement('option');
                tmp.value = object
                tmp.innerText = object
                objectDropdown.appendChild(tmp);
            })
    
            document.getElementById('pose-object-mapping-btn').setAttribute('style', '')
            document.getElementById('pose-object-mapping-btn').addEventListener('click', () => {
                let nodes = document.getElementById('pose-object-mapping')
                let pose = getVal(document.getElementById('pose'));
                let object = getVal(document.getElementById('object'));
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

                                dataWebSocket.send(JSON.stringify({ dataType : "object", data : 
                                
                                predictions.filter((element) => {
                                    return registered.includes(element[1])
                                })
                            
                            }));
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

                        objects.forEach((element) => {
                            if (!detected.includes(element["class"])) {
                                detected.push(element["class"]);
            
                                let tmpTr = document.createElement('tr');
                                let tmpIdxTd = document.createElement('td');
                                let tmpIdxStr = document.createTextNode(detectedCnt);
                                tmpIdxTd.appendChild(tmpIdxStr);
                                let tmpNameTd = document.createElement('td');
                                let tmpNameStr = document.createTextNode(element["class"]);
                                tmpNameTd.appendChild(tmpNameStr);
                                
                                let tmpInputTd = document.createElement('td');
                                let tmpInput = document.createElement('input');
                                tmpInput.type = "checkbox"
                                tmpInput.id = element["class"]
                                tmpInput.value = element["class"]
                                tmpInput.checked = registered.includes(element["class"])
                                tmpInputTd.appendChild(tmpInput);
            
                                tmpTr.appendChild(tmpIdxTd);
                                tmpTr.appendChild(tmpNameTd);
                                tmpTr.appendChild(tmpInputTd);
            
                                registerResultTable.insertAdjacentElement('beforeend', tmpTr);
                                detectedCnt += 1
                            }
                        });
                    });
                    requestAnimationFrame(predict);
                }
            });
    
            const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
           
           setInterval(() => {
           
           var curr = new Date();
           const utc = curr.getTime() + (curr.getTimezoneOffset() * 60 * 1000);
           dataWebSocket.send(JSON.stringify({log : {data : objects, date : new Date(utc + (KR_TIME_DIFF))}}))}, 1000);
    
            registerBtn.addEventListener("click", function(){
            
                let output = detected.filter((element) => {
                        return document.getElementById(element).checked})
                    
                    registered.forEach((element) => {
                        if (!output.includes(element)){
                            output.push(element);
                        }
                    })
                    
                    registerWebSocket.send(JSON.stringify(
                        {dataType : "object", data : output}
                    ))
    
            });
    
        </script>
    
    </body>
    
    </html>
    `
}
