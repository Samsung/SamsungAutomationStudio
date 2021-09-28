"use strict"


module.exports = function(RED) {

    // The node .js file defines the runtime behavior of the node.

    function MediapipeNode(config) {

        function HTML() {
            const html = String.raw`
            <!DOCTYPE html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
                    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" crossorigin="anonymous"></script>
                    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
                    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" crossorigin="anonymous"></script>
                    <script src="https://cdn.socket.io/4.1.2/socket.io.min.js" integrity="sha384-toS6mmwu70G0fw54EGlWWeA4z3dyJ+dlXBtSURSKN4vyRFOcxd3Bzjj/AoOwY+Rg" crossorigin="anonymous"></script>

                    <style>
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
                
                    #regist-btn {
                        background-color: #B2A1F4;
                        border: 1px solid grey;
                        border-left: none;
                        height: 21px;
                        color: white;
                    }
                
                    #regist-btn:hover {
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
                        <input id="pose-motion-name" type="text" placeholder="Motion Pose Name"><button id="regist-btn">Regist</button>
                        </div>
                        <div id="result-div" style="display: none;">
                        <p id="motion-result-message"></p>
                        <canvas class="capture_canvas" width="480px" height="270px" style="border:1px solid black"></canvas>
                        <div id="motion-result-keypoint"></div>
                        </div>
                    </div>
                    <hr>
                    <div align="center">
                        <a href="https://github.com/5FNSaaS">5FNSaaS</a>
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
                return function() {
                    stopped = true
                }
            }


            /* motion regist timer */
            const timerSecond = document.getElementById("secondTimer");
            var second = timerSecond.options[timerSecond.selectedIndex].value;
            var poseData = null;
            var poseName = null;


            document.getElementById("secondTimer").addEventListener('change', () => {
                second = timerSecond.options[timerSecond.selectedIndex].value;
                console.log(second);
            })


            /* motion name empty check */
            var poseMotionName = document.getElementById("pose-motion-name");
            document.getElementById("regist-btn").addEventListener('click', () => {
                if (poseMotionName.value === "" || poseMotionName.value === undefined) {
                document.getElementById("motion-result-message").style.color = "red";
                document.getElementById("motion-result-message").textContent = "[Fail] Invalid Motion-Name";
                document.getElementsByClassName("capture_canvas")[0].style.display = "none";
                document.getElementById("result-div").style.display = "block";
                }
                else {
                onCapture(poseMotionName.value);
                }

                document.getElementById("pose-motion-name").value = "";
            })


            // DOM 엘리먼트
            const videoElement = document.getElementsByClassName('input_video')[0]
            const canvasElement = document.getElementsByClassName('output_canvas')[0]
            const captureElement = document.getElementsByClassName('capture_canvas')[0];
            const canvasCtx = canvasElement.getContext('2d')
            const captureCtx = captureElement.getContext('2d');


            // Detection 데이터 전송할 웹소켓 인스턴스 생성
            const dataWebSocket = new WebSocket('ws://localhost:1880/ws/data')


            /* visualize and transmit registered data  */
            function onCapture(motionName) {
                setTimeout((motionName) => {
                captureCtx.drawImage(canvasElement, 0, 0, captureElement.width, captureElement.height);
                var detail = "";
                const fixed = 5;

                detail += "<table style='display:inline;margin:0px 5px;'>";
                detail += "<caption>Estimated Pose</caption>";
                detail += "<tr><th></th><th>x</th><th>y</th><th>z</th><th>visibility</th></tr>";
                for (let idx = 0; idx < poseData.poseLandmarks.length; idx++) {
                    detail += "<tr>";
                    detail += "<td align='center'>" + idx + "</td>";
                    detail += "<td>" + poseData.poseLandmarks[idx].x.toFixed(fixed) + "</td>"
                    detail += "<td>" + poseData.poseLandmarks[idx].y.toFixed(fixed) + "</td>"
                    detail += "<td>" + poseData.poseLandmarks[idx].z.toFixed(fixed) + "</td>"
                    detail += "<td>" + poseData.poseLandmarks[idx].z.toFixed(fixed) + "</td>"
                    detail += "</tr>";
                }
                detail += "</table>";

                document.getElementById("motion-result-keypoint").innerHTML = '<br><b>' + motionName + "</b> Motion Detail <br>" + detail;
                document.getElementById("motion-result-message").style.color = "green";
                document.getElementById("motion-result-message").textContent = "Regist Success! You can used [" + motionName + "] motion";
                document.getElementsByClassName("capture_canvas")[0].style.display = "block";
                document.getElementById("pose-motion-name").value = "";
                document.getElementById("result-div").style.display = "block";


                poseData.regist = true;
                poseData.poseName = motionName;
                dataWebSocket.send(JSON.stringify(poseData));
                }, document.getElementById("secondTimer").value * 1000, motionName);
            }


            // 미러링 관련 소켓 인스턴스 생성
            let urlCreator
            let mirrorSocket
            const isMirror = ${config.isMirror}
            if (isMirror) {
                const mirrorPort = ${config.mirrorPort}
                urlCreator = window.URL || window.webkitURL
                mirrorSocket = io('http://localhost:' + mirrorPort)
                mirrorSocket.on("connect", () => {
                    console.log("connection server")
                    mirrorSocket.emit("echo", "echo from mediapipe")
                })
            }


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
                canvasCtx.globalCompositeOperation = 'source-over';
                drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                    { color: '#f2d6ae', lineWidth: 5 });
                drawLandmarks(canvasCtx, results.poseLandmarks,
                    { color: '#b2a1f4', lineWidth: 1 });
                canvasCtx.restore()
                
                // 랜드마크 데이터 웹소켓으로 전송
                if (results.poseLandmarks) {
                    if (dataWebSocket.readyState === 1) {
                        results.regist = false;
                        results.poseName = poseName;
                        dataWebSocket.send(JSON.stringify(results))

                        poseData = results;
                        poseName = null;
                    }
                }
                
                // 캔버스 데이터를 블롭화하여 미러링 노드로 전송 (아래 링크 참고하였음)
                // https://github.com/Infocatcher/Right_Links/issues/25
                // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
                if (isMirror && mirrorSocket.connected) {
                    canvasElement.toBlob(function (blob) {
                        const imageUrl = urlCreator.createObjectURL(blob)
                        mirrorSocket.emit('video', imageUrl)
                    }, 'image/webp')
                }
            }


            // Mediapipe의 Pose 인스턴스 생성
            const pose = new Pose({locateFile: (file) => {
                return 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/' + file
            }})


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
                    videoElement.oncanplay = function(e) {
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
            msg.payload = HTML()

            // send와 done은 1.0 버전 이후에 추가된 기능
            // 0.x 버전에서 호환되게끔 하려면 아래처럼 처리하면 됨
            if (done) {
                done()
            }
        
            // 인풋을 받은 후에 외부로 메시지를 보낼 때 (0.x 버전 호환)
            send = send || function() { this.send.apply(this, arguments )}
            send(msg)
        })
    
        // 외부로 메시지를 보낼 때
        this.send({ payload: 'this is message from MediapipeNode' })
    
        // 다른 플로우가 배포되면, 기존의 노드들은 삭제됩니다.
        // 이 삭제를 리스닝해서 무언가를 해야 한다면 아래처럼 하면 됩니다.
        this.on('close', function() {
            // do something
        })
    }
    RED.nodes.registerType("mediapipe", MediapipeNode)
}

