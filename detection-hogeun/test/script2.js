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


                // DOM 엘리먼트
                const inputElement = document.getElementById('input-canvas')
                const outputElement = document.getElementById('output-canvas')
                const captureElement = document.getElementById('capture-canvas')
                // const inputCtx = inputElement.getContext('2d')
                const outputCtx = outputElement.getContext('2d')
                const captureCtx = captureElement.getContext('2d')


                // 최초 Canvas -> AudioContext 시작하기 위한 클릭 유도
                // inputCtx.font = '30px sans-serif'
                // inputCtx.textAlign = 'center'
                // inputCtx.fillText('Click to start!', 300, 185)


                // Detection 데이터 전송할 웹소켓 인스턴스 생성
                const dataWebSocket = new WebSocket('ws://localhost:1880/ws/data')

                dataWebSocket.onmessage = (msg) => {
                    if (msg.data != null) {
                        onCapture(msg.data)
                    }
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
                    if (isMirror && mirrorSocket.connected) {
                        outputElement.toBlob(function (blob) {
                            const imageUrl = urlCreator.createObjectURL(blob)
                            mirrorSocket.emit('video', imageUrl)
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
                const rtspPort = ${config.rtspPort}
                const rtspClient = new WebSocket('ws://localhost:' + rtspPort)

                let isStart = false
                let isDataReady = false

                rtspClient.onmessage = function (e) {
                    if (!isStart && e.data.size > 8) {
                        isDataReady = true
                    }
                }
                
                const onclick = function () {
                    console.log('hello')
                    if (!isStart && isDataReady) {
                        console.log('hellow')
                        
                        isFirst = true
                        // inputCtx.clearRect(0, 0, inputElement.width, inputElement.height)
                        // inputElement.classList.toggle('clickable')
                        // inputElement.removeEventListener('click', onclick)
                        
                        const player = new jsmpeg(rtspClient, {
                            canvas: inputElement
                        })
                        startDetect(render)

                        document.getElementById('h1').removeEventListener('click', onclick)
                    }
                }
                document.getElementById('h1').addEventListener('click', onclick)