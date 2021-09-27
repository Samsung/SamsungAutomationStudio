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
                    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
                    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" crossorigin="anonymous"></script>
                    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
                    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" crossorigin="anonymous"></script>
                    <script src="https://cdn.socket.io/4.1.2/socket.io.min.js" integrity="sha384-toS6mmwu70G0fw54EGlWWeA4z3dyJ+dlXBtSURSKN4vyRFOcxd3Bzjj/AoOwY+Rg" crossorigin="anonymous"></script>
                </head>
                
                <body>
                    <div class="container">
                    <video class="input_video"></video>
                    <canvas class="output_canvas" width="1280px" height="720px"></canvas>
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


            // DOM 엘리먼트
            const videoElement = document.getElementsByClassName('input_video')[0]
            const canvasElement = document.getElementsByClassName('output_canvas')[0]
            const canvasCtx = canvasElement.getContext('2d')


            // Detection 데이터 전송할 웹소켓 인스턴스 생성
            const dataWebSocket = new WebSocket('ws://localhost:1880/ws/data')


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
                canvasCtx.globalCompositeOperation = 'source-over'
                drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                                {color: '#00FF00', lineWidth: 4})
                drawLandmarks(canvasCtx, results.poseLandmarks,
                                {color: '#FF0000', lineWidth: 2})
                canvasCtx.restore()
                
                // 랜드마크 데이터 웹소켓으로 전송
                if (results.poseLandmarks) {
                    if (dataWebSocket.readyState === 1) {
                        dataWebSocket.send(JSON.stringify(results.poseLandmarks))
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

