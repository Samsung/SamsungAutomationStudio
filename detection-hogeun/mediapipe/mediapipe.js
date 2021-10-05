"use strict"


module.exports = function(RED) {

    function MediapipeNode(config) {

        function HTML() {
            const html = String.raw`
            <!DOCTYPE html>
            <html>
            
            <head>
                <meta charset="utf-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" crossorigin="anonymous"></script>
                <script src="https://cdn.socket.io/4.1.2/socket.io.min.js" integrity="sha384-toS6mmwu70G0fw54EGlWWeA4z3dyJ+dlXBtSURSKN4vyRFOcxd3Bzjj/AoOwY+Rg" crossorigin="anonymous"></script>
                <link rel="shortcut icon" type="image/x-icon" href="https://cdn-icons-png.flaticon.com/512/1658/1658879.png">
                <title>Pose Detection</title>
                    
                <style>
                    a {
                        text-decoration: none;
                    }
            
                    body {
                        overflow-y: scroll;
                    }
            
                    .btn {
                        border: none;
                        width: 100px;
                        height: 25px;
                        border-radius: 10px;
                    }
            
                    .btn:first-child {
                        background-color: #B2A1F4;
                        color: white;
                    }
            
                    .btn:hover {
                        cursor: pointer;
                    }
            
                    .btn:hover:first-child {
                        background-color: #7557f0;
                    }
            
                    .btn:hover:last-child {
                        background-color: grey;
                    }
            
                    table {
                        width: 100%;
                        border-collapse: collapse;
                    }
            
                    th,
                    td {
                        border: 1px solid rgb(216, 216, 216);
                        padding: 3px;
                    }
            
                    .tooltip {
                        position: relative;
                        display: inline-block;
                    }
            
                    .tooltip .tooltip-content {
                        visibility: hidden;
                        background-color: rgba(255, 255, 255, 0.8);
                        color: black;
                        text-align: center;
                        position: absolute;
                        top: 3px;
                        left: 3px;
                        padding-left: 15px;
                        padding-right: 15px;
                        margin-top: 0px;
                        border-radius: 10px;
                        z-index: 1;
                    }
            
                    .tooltip:hover .tooltip-content {
                        visibility: visible;
                    }
            
                    #captrue-btn {
                        background-color: #B2A1F4;
                        border: 1px solid grey;
                        border-left: none;
                        height: 21px;
                        color: white;
                    }
            
                    #captrue-btn:hover {
                        background-color: #7557f0;
                        cursor: pointer;
                    }
                </style>
            </head>
            
            <body>
                <div align="center" style="min-height: 800px;">
                    <h1>Pose Detection Page</h1>
                    <div style="display: inline-block;" align="center" class="tooltip">
                        <video class="input_video" width="600px" height="340px" crossorigin="anonymous"
                            style="border:3px solid grey"></video><br>
                        <div class="tooltip-content">
                            <p>Your Camera</p>
                        </div>
                    </div>
                    <div style="display: inline-block;" align="center" class="tooltip">
                        <canvas class="output_canvas" width="600px" height="340px" style="border:3px solid #B2A1F4"></canvas><br>
                        <div class="tooltip-content">
                            <p>Tracking your Pose</p>
                        </div>
                    </div>
                    <div>
                        <br>
                        <select id="secondTimer">
                            <option value="0" selected>Now</option>
                            <option value="1">1s Timer</option>
                            <option value="2">2s Timer</option>
                            <option value="3">3s Timer</option>
                        </select>
                        <input id="pose-motion-name" type="text" placeholder="Motion Pose Name"><button id="captrue-btn">Capture</button>
                    </div>
                    <div id="result-div" style="display: none;">
                        <p id="motion-result-message"></p>
                        <div id="regist-btn-bar" align="center">
                            <button id="regist-btn" class="btn">Regist</button> <button id="cancel-btn" class="btn">Cancel</button>
                          </div><br>          
                        <canvas class="capture_canvas" width="480px" height="270px" style="border:1px solid black"></canvas>
                        <div id="motion-result-keypoint"></div>
                    </div>
                </div>
                <hr>
                <div align="center" style="min-height: 100px;">
                    <br>
                    <a href="https://github.com/5FNSaaS">
                        <img style="width:15px"
                            src="data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJtMjU2IDBjLTE0MC42MDkzNzUgMC0yNTYgMTE1LjM5MDYyNS0yNTYgMjU2IDAgMTE5Ljk4ODI4MSA4NC4xOTUzMTIgMjI4Ljk4NDM3NSAxOTYgMjU2di04NC42OTUzMTJjLTExLjA3ODEyNSAyLjQyNTc4MS0yMS4yNzM0MzggMi40OTYwOTMtMzIuNTUwNzgxLS44MjgxMjYtMTUuMTI4OTA3LTQuNDY0ODQzLTI3LjQyMTg3NS0xNC41NDI5NjgtMzYuNTQ2ODc1LTI5LjkxMDE1Ni01LjgxNjQwNi05LjgxMjUtMTYuMTI1LTIwLjQ1MzEyNS0yNi44Nzg5MDYtMTkuNjcxODc1bC0yLjYzNjcxOS0yOS44ODI4MTJjMjMuMjUzOTA2LTEuOTkyMTg4IDQzLjM3MTA5MyAxNC4xNjc5NjkgNTUuMzEyNSAzNC4yMzA0NjkgNS4zMDQ2ODcgOC45MjE4NzQgMTEuNDEwMTU2IDE0LjE1MjM0MyAxOS4yNDYwOTMgMTYuNDY0ODQzIDcuNTc0MjE5IDIuMjMwNDY5IDE1LjcwNzAzMiAxLjE2MDE1NyAyNS4xODM1OTQtMi4xODc1IDIuMzc4OTA2LTE4Ljk3MjY1NiAxMS4wNzAzMTMtMjYuMDc0MjE5IDE3LjYzNjcxOS0zNi4wNzQyMTl2LS4wMTU2MjRjLTY2LjY3OTY4Ny05Ljk0NTMxMy05My4yNTM5MDYtNDUuMzIwMzEzLTEwMy44MDA3ODEtNzMuMjQyMTg4LTEzLjk3NjU2My0zNy4wNzQyMTktNi40NzY1NjMtODMuMzkwNjI1IDE4LjIzODI4MS0xMTIuNjYwMTU2LjQ4MDQ2OS0uNTcwMzEzIDEuMzQ3NjU2LTIuMDYyNSAxLjAxMTcxOS0zLjEwNTQ2OS0xMS4zMzIwMzItMzQuMjMwNDY5IDIuNDc2NTYyLTYyLjU0Njg3NSAyLjk4NDM3NS02NS41NTA3ODEgMTMuMDc4MTI1IDMuODY3MTg3IDE1LjIwMzEyNS0zLjg5MDYyNSA1Ni44MDg1OTMgMjEuMzg2NzE4bDcuMTkxNDA3IDQuMzIwMzEzYzMuMDA3ODEyIDEuNzkyOTY5IDIuMDYyNS43Njk1MzEgNS4wNzAzMTIuNTQyOTY5IDE3LjM3MTA5NC00LjcxODc1IDM1LjY4MzU5NC03LjMyNDIxOSA1My43MjY1NjMtNy41NTg1OTQgMTguMTc5Njg3LjIzNDM3NSAzNi4zNzUgMi44Mzk4NDQgNTQuNDY0ODQ0IDcuNzVsMi4zMjgxMjQuMjM0Mzc1Yy0uMjAzMTI0LS4wMzEyNS42MzI4MTMtLjE0ODQzNyAyLjAzNTE1Ny0uOTg0Mzc1IDUxLjk3MjY1Ni0zMS40ODA0NjkgNTAuMTA1NDY5LTIxLjE5MTQwNiA2NC4wNDI5NjktMjUuNzIyNjU2LjUwMzkwNiAzLjAwNzgxMiAxNC4xMjg5MDYgMzEuNzg1MTU2IDIuOTE3OTY4IDY1LjU4MjAzMS0xLjUxMTcxOCA0LjY1NjI1IDQ1LjA1ODU5NCA0Ny4zMDA3ODEgMTkuMjQ2MDk0IDExNS43NTM5MDYtMTAuNTQ2ODc1IDI3LjkzMzU5NC0zNy4xMTcxODggNjMuMzA4NTk0LTEwMy43OTY4NzUgNzMuMjUzOTA3di4wMTU2MjRjOC41NDY4NzUgMTMuMDI3MzQ0IDE4LjgxNjQwNiAxOS45NTcwMzIgMTguNzYxNzE5IDQ2LjgzMjAzMnYxMDUuNzIyNjU2YzExMS44MDg1OTQtMjcuMDE1NjI1IDE5Ni0xMzYuMDExNzE5IDE5Ni0yNTYgLjAwMzkwNi0xNDAuNjA5Mzc1LTExNS4zODY3MTktMjU2LTI1NS45OTYwOTQtMjU2em0wIDAiLz48L3N2Zz4=" />
                        5FNSaaS
                    </a> |
                    <a href="https://github.com/rootkwak528">Hogeun Kwak</a> | <a href="https://github.com/eona1301">Hyeona Dang</a>
                    | <a href="https://github.com/whgusalsdl">Hyeonmin Cho</a> | <a href="https://github.com/483759">Ijin Yun</a> |
                    <a href="https://github.com/steven9408">Yeorae Jo</a><br>
                </div>
            </body>
            
            </html>
            
            <script type="module">
                // 비활성화된 탭에서도 캔버스가 지속적으로 업데이트되도록 하기 위해
                // 재귀적으로 생성되는 빈 오디오 트랙의 Loop를 사용합니다. (각 오디오 트랙의 지속시간은 10fps 기준 0.1초)
                // 빈 오디오 트랙의 생성자 함수에 캔버스 렌더링 메소드를 포함해 지속적 렌더링이 가능해집니다.
                // 관련 링크 : https://stackoverflow.com/questions/44156528/canvas-doesnt-repaint-when-tab-inactive-backgrounded-for-recording-webgl
            
            
                // 디텍션 시작 함수
                function startDetect(renderFunc) {
                    // 최초의 오디오 트랙을 생성한다.
                    // (Loop 정지 함수는 현재 사용하지 않고 있음, 개발자의 취지에 따라 커스터마이징 가능)
                    var fps = 60
                    var stopLoop = audioTimerLoop(renderFunc, 1000 / fps)
                }
            
            
                // 오디오 트랙 Loop 생성자
                function audioTimerLoop(renderFunc, frequency) {
                    var freq = frequency / 1000  // AudioContext는 second 단위
                    var aCtx = new AudioContext()
                    var silence = aCtx.createGain()
                    silence.gain.value = 0
                    silence.connect(aCtx.destination)  // 오디오 트랙 비우기 (추측)
            
                    onOSCend()
            
                    var stopped = false  // loop를 멈추기 위한 flag
                    async function onOSCend() {
                        // 캔버스 렌더링 (비동기)
                        await renderFunc()
            
                        // loop 생성
                        var osc = aCtx.createOscillator()
                        osc.onended = onOSCend  // loop가 되는 이유
                        osc.connect(silence)
                        osc.start()  // 당장 시작
                        osc.stop(aCtx.currentTime + freq)  // 한 프레임 이후 정지
            
                        // loop 정지
                        if (stopped) {
                            osc.onended = function () {
                                aCtx.close()
                                return
                            }
                        }
                    }
                    // loop를 정지하기 위한 함수를 반환한다.
                    return function () {
                        stopped = true
                    }
                }
            
            
                /* motion regist timer */
                const timerSecond = document.getElementById("secondTimer")
                var second = timerSecond.options[timerSecond.selectedIndex].value
                var poseData = null
                var poseName = null
            
            
                document.getElementById("secondTimer").addEventListener('change', () => {
                    second = timerSecond.options[timerSecond.selectedIndex].value
                })
            
            
            
            
                /* motion name empty check */
                var poseMotionName = document.getElementById("pose-motion-name")
                document.getElementById("captrue-btn").addEventListener('click', () => {
                    if (poseMotionName.value === "" || poseMotionName.value === undefined) {
                        isFail("[Fail] Invalid Name : The motion name is empty.")
                    }else if(poseData==null){
                        isFail("[Fail] Keypoint not found. Show your hands on cam!");
                    }
                    else {
                        onCapture(poseMotionName.value, document.getElementById("secondTimer").value)
                    }
                })
            
                function isFail(message) {
                    document.getElementById("motion-result-message").style.color = "red"
                    document.getElementById("motion-result-message").textContent = message
                    document.getElementsByClassName("capture_canvas")[0].style.display = "none"
                    document.getElementById("result-div").style.display = "block"
                    document.getElementById("regist-btn-bar").style.display = "none";
                }
            
            
                // DOM 엘리먼트
                const videoElement = document.getElementsByClassName('input_video')[0]
                const canvasElement = document.getElementsByClassName('output_canvas')[0]
                const captureElement = document.getElementsByClassName('capture_canvas')[0]
                const canvasCtx = canvasElement.getContext('2d')
                const captureCtx = captureElement.getContext('2d')
            
            
                // Detection 데이터 전송할 웹소켓 인스턴스 생성
                const dataWebSocket = new WebSocket('ws://localhost:1880/ws/${config.dataSocketUrl}')

            
                /* visualize and transmit registered data  */
                function onCapture(motionName, timer) {
                    setTimeout((motionName) => {
                        captureCtx.drawImage(canvasElement, 0, 0, captureElement.width, captureElement.height)
                        var detail = ""
                        const fixed = 5
            
                        detail += "<table style='display:inline;margin:0px 5px;'>"
                        detail += "<caption>Estimated Pose</caption>"
                        detail += "<tr><th></th><th>x</th><th>y</th><th>z</th><th>visibility</th></tr>"
                        for (let idx = 0; idx < poseData.poseLandmarks.length; idx++) {
                            detail += "<tr>";
                            detail += "<td align='center'>" + idx + "</td>"
                            detail += "<td>" + poseData.poseLandmarks[idx].x.toFixed(fixed) + "</td>"
                            detail += "<td>" + poseData.poseLandmarks[idx].y.toFixed(fixed) + "</td>"
                            detail += "<td>" + poseData.poseLandmarks[idx].z.toFixed(fixed) + "</td>"
                            detail += "<td>" + poseData.poseLandmarks[idx].visibility.toFixed(fixed) + "</td>"
                            detail += "</tr>"
                        }
                        detail += "</table>"

                        /* Save data immediately after timer runs */
                        poseData["regist"] = true;
                        poseData["poseName"] = motionName;
                        poseDataResult = poseData;
            
                        document.getElementById("motion-result-keypoint").innerHTML = '<br><b>' + motionName + "</b> Motion Detail <br>" + detail
                        document.getElementById("motion-result-message").style.color = "green"
                        document.getElementById("motion-result-message").textContent = "Regist Success! You can used [" + motionName + "] motion"
                        document.getElementsByClassName("capture_canvas")[0].style.display = "block"
                        document.getElementById("result-div").style.display = "block"
                        document.getElementById("regist-btn-bar").style.display = "block";
                    }, timer * 1000, motionName)
                }
            
                var poseDataResult;
                /* send pose data */
                document.getElementById("regist-btn").addEventListener('click', function(){
                    document.getElementById("motion-result-message").style.color = "green";
                    document.getElementById("motion-result-message").textContent = "[" + poseMotionName.value +"] Data sent successfully! Check out the registration results!";
                    ws.send(JSON.stringify(poseDataResult));
                })
            
                /* result message reset*/
                document.getElementById("pose-motion-name").addEventListener('focus', onClear);
                document.getElementById("cancel-btn").addEventListener('click', function(){
                document.getElementById("pose-motion-name").value = "";
                onClear();
                });
            
                function onClear(){
                document.getElementById("motion-result-message").textContent = "";
                document.getElementById("motion-result-keypoint").innerHTML = "";
                document.getElementById("result-div").style.display = "none";
                }
            
                // 미러링 관련 소켓 인스턴스 생성
            
            
            
                // 캔버스에 Pose Detection 결과값 렌더링하는 함수
                function onResults(results) {
                    // 빈 캔버스 로드
                    canvasCtx.save()
                    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)
            
                    // 캔버스에 비디오 화면 표시
                    canvasCtx.globalCompositeOperation = 'destination-atop'
                    canvasCtx.drawImage(
                        results.image, 0, 0, canvasElement.width, canvasElement.height)
            
                    // 캔버스에 디텍션 랜드마크 표시
                    canvasCtx.globalCompositeOperation = 'source-over'
                    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                        { color: '#f2d6ae', lineWidth: 5 })
                    drawLandmarks(canvasCtx, results.poseLandmarks,
                        { color: '#b2a1f4', lineWidth: 1 })
                    canvasCtx.restore()
            
                    // 랜드마크 데이터 웹소켓으로 전송
                    if (results.poseLandmarks) {
                        if (dataWebSocket.readyState === 1) {
                            results.regist = false
                            results.poseName = poseName
                            dataWebSocket.send(JSON.stringify(results))
            
                            poseData = results
                            poseName = null
                        }
                    }
            
                    // 캔버스 데이터를 블롭화하여 미러링 노드로 전송 (아래 링크 참고하였음)
                    // https://github.com/Infocatcher/Right_Links/issues/25
                    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
            
                }
            
            
                // Mediapipe의 Pose 인스턴스 생성
                const pose = new Pose({
                    locateFile: (file) => {
                        return 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/' + file
                    }
                })
            
            
                // Pose 인스턴스 설정
                pose.setOptions({
                    modelComplexity: 1,
                    smoothLandmarks: true,
                    enableSegmentation: true,
                    smoothSegmentation: true,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5
                })
                pose.onResults(onResults)
            
            
                // 렌더링 함수 (비동기)
                async function render() {
                    await pose.send({ image: videoElement })
                }
            
            
                // 미디어 장치 연결 및 Detection 시작
                const mediaConstraints = {
                    audio: false, // 음성 포함하려면 값을 'true'로 바꿔야 함
                    video: { width: 1280, height: 720 }
                }
                navigator.mediaDevices.getUserMedia(mediaConstraints)
                    .then(stream => {
                        videoElement.srcObject = stream
                        videoElement.oncanplay = function (e) {
                            videoElement.play()
                                .then(() => {
                                    startDetect(render)
                                })
                        }
                    })
                    .catch(err => {
                        console.log(err)
                    })
            </script>
            `
            return html
        }

        RED.nodes.createNode(this, config)
        
        // listener to receive messages from the up-stream nodes in a flow.
        this.on('input', (msg, send, done) => {
            // Return HTML document to the client.
            // 클라이언트에 HTML 문서 반환
            msg.payload = HTML()
            send = send || function() { this.send.apply(this, arguments )}
            send(msg)
        })
    }
    RED.nodes.registerType("mediapipe", MediapipeNode)
}

