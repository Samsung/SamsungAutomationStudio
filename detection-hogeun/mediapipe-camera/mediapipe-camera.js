"use strict"


const ws = require('ws')
const http = require('http')
const cors = require('cors')
const express = require('express')
require("dotenv").config()


module.exports = function(RED) {

    function MediapipeCameraNode(config) {

        function HTML() {
            const html = String.raw`
            <!DOCTYPE html>
            <html lang="en">

            <head>
                <meta charset="UTF-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <script src="https://cdnjs.cloudflare.com/ajax/libs/jsmpeg/0.1/jsmpg.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
                <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" crossorigin="anonymous"></script>
                <script src="https://cdn.socket.io/4.1.2/socket.io.min.js" integrity="sha384-toS6mmwu70G0fw54EGlWWeA4z3dyJ+dlXBtSURSKN4vyRFOcxd3Bzjj/AoOwY+Rg" crossorigin="anonymous"></script>
                
                <link rel="shortcut icon" type="image/x-icon" href="https://cdn-icons-png.flaticon.com/512/1658/1658879.png">
                <title>rtsp client</title>
                                
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

                    #input-canvas {
                        width: 600px;
                        height: 340px;
                    }

                    .clickable:hover {
                        cursor: pointer;
                    }
                </style>
            </head>

            <body>
                <div align="center" style="min-height: 800px;">
                    <div style="display: inline-block;" align="center" class="tooltip">
                        <canvas id="input-canvas" width="600px" height="340px" style="border:3px solid grey"></canvas><br>
                        <div class="tooltip-content">
                            <p>Your Camera</p>
                        </div>
                    </div>
                    <div style="display: inline-block;" align="center" class="tooltip">
                        <canvas id="output-canvas" width="600px" height="340px" style="border:3px solid #B2A1F4"></canvas><br>
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
                        <canvas id="capture-canvas" width="480px" height="270px" style="border:1px solid black"></canvas>
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

            <script type="text/javascript">
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
                        isFail("[Fail] Keypoint not found. Show your hands on cam!")
                    }
                    else {
                        onCapture(poseMotionName.value)
                    }
                })

                function isFail(message) {
                    document.getElementById("motion-result-message").style.color = "red"
                    document.getElementById("motion-result-message").textContent = message
                    document.getElementById("capture-canvas").style.display = "none"
                    document.getElementById("result-div").style.display = "block"
                    document.getElementById("regist-btn-bar").style.display = "none"
                }


                // DOM 엘리먼트
                const inputElement = document.getElementById('input-canvas')
                const outputElement = document.getElementById('output-canvas')
                const captureElement = document.getElementById('capture-canvas')
                const outputCtx = outputElement.getContext('2d')
                const captureCtx = captureElement.getContext('2d')


                // Detection 데이터 전송할 웹소켓 인스턴스 생성
                const dataWebSocket = new WebSocket('${config.dataSocketUrl}')
                

                /* visualize and transmit registered data  */
                function onCapture(motionName) {
                    setTimeout((motionName) => {
                        captureCtx.drawImage(outputElement, 0, 0, captureElement.width, captureElement.height)
                        var detail = ""
                        const fixed = 5

                        detail += "<table style='display:inline;margin:0px 5px;'>"
                        detail += "<caption>Estimated Pose</caption>"
                        detail += "<tr><th></th><th>x</th><th>y</th><th>z</th><th>visibility</th></tr>"
                        for (let idx = 0; idx < poseData.poseLandmarks.length; idx++) {
                            detail += "<tr>"
                            detail += "<td align='center'>" + idx + "</td>"
                            detail += "<td>" + poseData.poseLandmarks[idx].x.toFixed(fixed) + "</td>"
                            detail += "<td>" + poseData.poseLandmarks[idx].y.toFixed(fixed) + "</td>"
                            detail += "<td>" + poseData.poseLandmarks[idx].z.toFixed(fixed) + "</td>"
                            detail += "<td>" + poseData.poseLandmarks[idx].visibility.toFixed(fixed) + "</td>"
                            detail += "</tr>"
                        }
                        detail += "</table>"

                        document.getElementById("motion-result-keypoint").innerHTML = '<br><b>' + motionName + "</b> Motion Detail <br>" + detail
                        document.getElementById("motion-result-message").style.color = "green"
                        document.getElementById("motion-result-message").textContent = "Regist Success! You can used [" + motionName + "] motion"
                        document.getElementsByClassName("capture_canvas")[0].style.display = "block"
                        document.getElementById("result-div").style.display = "block"
                        document.getElementById("regist-btn-bar").style.display = "block"

                        /*
                        poseData.regist = true
                        poseData.poseName = motionName
                        dataWebSocket.send(JSON.stringify(poseData))
                        */
                    }, document.getElementById("secondTimer").value * 1000, motionName)
                }

                /* send pose data */
                document.getElementById("regist-btn").addEventListener('click', function(){
                    document.getElementById("motion-result-message").style.color = "green"
                    document.getElementById("motion-result-message").textContent = "[" + poseMotionName.value +"] Data sent successfully! Check out the registration results!";
                    poseData["regist"] = true
                    poseData["poseName"] = poseMotionName.value
                    dataWebSocket.send(JSON.stringify(poseData))
                    document.getElementById("pose-motion-name").value = ""
                })

                /* result message reset*/
                document.getElementById("pose-motion-name").addEventListener('focus', onClear)
                document.getElementById("cancel-btn").addEventListener('click', function(){
                    document.getElementById("pose-motion-name").value = ""
                    onClear()
                });

                function onClear(){
                    document.getElementById("motion-result-message").textContent = ""
                    document.getElementById("motion-result-keypoint").innerHTML = ""
                    document.getElementById("result-div").style.display = "none"
                }


                // 미러링 관련 소켓 인스턴스 생성
                const urlCreator = window.URL || window.webkitURL
                const monitorUrl = 'http://' + ${config.serverUrl} + ':' + ${config.monitorPort}
                const monitorSocket = io(monitorUrl)
                monitorSocket.on("connect", () => {
                    console.log("connection server")
                    monitorSocket.emit("echo", "echo from mediapipe")
                })


                // Pose Detection result function
                // 캔버스에 Pose Detection 결과값 렌더링하는 함수
                function onResults(results) {
                    // clear canvas
                    // 빈 캔버스 로드
                    outputCtx.save()
                    outputCtx.clearRect(0, 0, outputElement.width, outputElement.height)

                    // draw video image on canvas.
                    // 캔버스에 비디오 화면 표시
                    outputCtx.globalCompositeOperation = 'destination-atop'
                    outputCtx.drawImage(
                        results.image, 0, 0, outputElement.width, outputElement.height)

                    // draw landmarks on canvas.
                    // 캔버스에 랜드마크 표시
                    outputCtx.globalCompositeOperation = 'source-over'
                    drawConnectors(outputCtx, results.poseLandmarks, POSE_CONNECTIONS,
                        { color: '#f2d6ae', lineWidth: 5 })
                    drawLandmarks(outputCtx, results.poseLandmarks,
                        { color: '#b2a1f4', lineWidth: 1 })
                    outputCtx.restore()

                    // transport landmark data via web socket.
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

                    // transport <canvas> data in form of blob. (I referenced the link below)
                    // 캔버스 데이터를 블롭화하여 미러링 노드로 전송 (아래 링크 참고하였음)
                    // https://github.com/Infocatcher/Right_Links/issues/25
                    // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
                    if (monitorSocket.connected) {
                        outputElement.toBlob(function (blob) {
                            const imageUrl = urlCreator.createObjectURL(blob)
                            monitorSocket.emit('video', imageUrl)
                        }, 'image/webp')
                    }
                }


                // construct Mediapipe Pose instance.
                // Mediapipe의 Pose 인스턴스 생성
                const pose = new Pose({
                    locateFile: (file) => {
                        return 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/' + file
                    }
                })


                // Pose instance setup.
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


                // rendering function (Asynchronous)
                // 렌더링 함수 (비동기)
                async function render() {
                    await pose.send({ image: inputElement })
                }


                // deliver rtsp streaming data from WebSocket server to <canvas>. (I referenced the link below)
                // 웹소켓 서버로부터 rtsps 스트리밍 데이터 받아서 canvas에 출력 (아래 링크를 참고하였음)
                // https://www.npmjs.com/package/node-rtsp-stream
                // https://webnautes.tistory.com/1476
                const rtspUrl = 'ws://' + ${config.serverUrl} + ':' + ${config.rtspPort}
                const rtspTest = new WebSocket(rtspUrl)
                rtspTest.onmessage = function (e) {
                    
                    // RTSP 웹소켓으로부터 충분한 데이터가 오면 렌더링 시작
                    if (e.data.size > 8) {
                        rtspTest.close()
    
                        // RTSP 클라이언트 생성 및 렌더링
                        const rtspClient = new WebSocket(rtspUrl)
                        const player = new jsmpeg(rtspClient, {
                            canvas: inputElement,
                            pauseWhenHidden: false
                        })

                        // AudioContext 시작하기 위한 장치 탐색
                        const mediaConstraints = {
                            audio: false, // 음성 포함하려면 값을 'true'로 바꿔야 함
                            video: true
                        }
                        navigator.mediaDevices.getUserMedia(mediaConstraints)
                            .then(stream => {
                                startDetect(render)
                            })
                            .catch(err => {
                                console.log(err)
                            })
                    }
                }


            </script>
            `
            return html
        }

        RED.nodes.createNode(this, config)
        let rtspStream

        // .env variable
        // .env로부터 변수 호출
        const mnid = process.env.SAMSUNG_MNID
        const token = process.env.SAMSUNG_TOKEN
        
        // on input event.
        // input 들어오면
        this.on('input', (msg, send, done) => {

            // construct socket server for RTSP.
            // RTSP socket 서버 생성
            const rtspUrl = msg.payload.components.main.videoStream.stream.value.OutHomeURL.split('//')[1]
            const rtspPort = config.rtspPort || 9999
            const app = express()

            // CORS config
            // CORS 설정
            app.use(cors({
                origin: true,
                credentials: true
            }))
            const httpServer = http.createServer(app)

            // if port is busy, don't do anything but return html document.
            // port 사용 중이면 HTML 문서만 반환
            httpServer.once('error', err => {
                if (err.code === 'EADDRINUSE') {
                    console.log(`Socket.io [RTSP] : port ${rtspPort} is busy.`)
                }
            })

            // if port is available, run the socket server.
            // port 사용 가능할 경우, socket 서버 실행
            httpServer.once('listening', () => {
                console.log(`Socket.io [RTSP] : port ${rtspPort} is now ready.`)

                // rtsp-stream class inheritance. (I refered the links below)
                // rtsp-stream 클랙스 상속 (아래 링크를 참고하였음)
                // https://webclub.tistory.com/404
                // https://developer.mozilla.org/ko/docs/Web/JavaScript/Inheritance_and_the_prototype_chain
                const Stream = require('node-rtsp-stream')
                const newStream = Stream
                newStream.prototype = Stream.prototype
                newStream.prototype.constructor = newStream

                // rtsp-stream method override.
                // rtsp-stream 메서드 오버라이드
                newStream.prototype.pipeStreamToSocketServer = function () {
                    
                    // CORS configed WebSocket Server.
                    // cors 처리한 WebSocket Server
                    this.wsServer = new ws.Server({
                        server: httpServer
                    })
                    this.wsServer.on("connection", (socket, request) => {
                        return this.onSocketConnect(socket, request)
                    })
                    this.wsServer.broadcast = function(data, opts) {
                        var results = []
                        for (let client of this.clients) {
                            if (client.readyState === 1) {
                                results.push(client.send(data, opts))
                            } else {
                                results.push(console.log("Error: Client from remoteAddress " + client.remoteAddress + " not connected."))
                            }
                        }
                        return results
                    }
                    return this.on('camdata', (data) => {
                        return this.wsServer.broadcast(data)
                    })
                }
                
                // construct newStream.
                // newStream 생성
                rtspStream = new newStream({
                    name: 'name',
                    streamUrl: `rtsps://${mnid}:${token}@${rtspUrl}`,
                    wsPort: rtspPort,
                    ffmpegOptions: { // options ffmpeg flags
                        '-stats': '', // an option with no neccessary value uses a blank string
                        '-r': 30 // options with required values specify the value after the key
                    }
                })
            })

            // :1880/ws/monitor  >>  :1881
            httpServer.listen(rtspPort)

            // return HTML document to the client.
            // 클라이언트에 HTML 문서 반환
            msg.payload = HTML()
            send = send || function() { this.send.apply(this, arguments )}
            send(msg)
        })
        
        // if flow is closed, rtspStream would be closed.
        // flow 중단되면, rtspStream 종료
        this.on('close', function() {
            rtspStream.stop()
        })
    }
    RED.nodes.registerType("mediapipe-camera", MediapipeCameraNode)
}