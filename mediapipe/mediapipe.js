"use strict"

const path = require('path')

// const CAMERA = require('@mediapipe/camera_utils')
// const POSE = require('@mediapipe/pose')

// // https://github.com/HiraokaHyperTools/msgreader/issues/5
// const Camera = CAMERA.Camera || CAMERA
// const Pose = POSE.Pose || POSE


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
                    <!-- <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils_3d/control_utils_3d.js" crossorigin="anonymous"></script> -->
                    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
                    <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" crossorigin="anonymous"></script>
                </head>
                
                <body>
                    <div class="container">
                    <video class="input_video"></video>
                    <!-- <button id="start-btn">start</button> -->
                    <canvas class="output_canvas" width="1280px" height="720px"></canvas>
                    <!-- <div class="landmark-grid-container"></div> -->
                    </div>
                </body>
            </html>
            
            <script type="module">
            function startVideo(canvasDom, render_func) {
    
                // var canvas = canvasDom.cloneNode()
                // var ctx = canvas.getContext('2d')
            
                // render_func()
            
                var fps = 60
                var stopLoop = audioTimerLoop(render_func, 1000 / fps)
            
                // window.onbeforeunload = function () {
                //     stopLoop()
                // }
            
                // setTimeout(function() {
                //     stopLoop()
                // }, 5000)
            }
            
            function audioTimerLoop(callback, frequency) {
            
                // 아래 링크를 참고함
                // https://stackoverflow.com/questions/44156528/canvas-doesnt-repaint-when-tab-inactive-backgrounded-for-recording-webgl
            
                var freq = frequency / 1000  // AudioContext time params are in seconds
                var aCtx = new AudioContext()
                var silence = aCtx.createGain()
                silence.gain.value = 0
                silence.connect(aCtx.destination)  // ??
            
                onOSCend()
            
                var stopped = false  // A flag to know when we'll stop the loop
                function onOSCend() {
                    var osc = aCtx.createOscillator()
                    osc.onended = onOSCend  // so we can loop
                    osc.connect(silence)  // ??
                    osc.start(0)  // start it now
                    osc.stop(freq)  // stop it next frame
            
                    callback()  // render
                    
                    if (stopped) {
                        osc.onended = function () {
                            aCtx.close()
                            return
                        }
                    }
                }
                // return a function to stop the loop
                return function() {
                    stopped = true
                }
            }
            
            
            const videoElement = document.getElementsByClassName('input_video')[0]
            const canvasElement = document.getElementsByClassName('output_canvas')[0]
            const canvasCtx = canvasElement.getContext('2d')
            // const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0]
            // const grid = new LandmarkGrid(landmarkContainer)
            
            const wsData = new WebSocket('wss://15.165.220.70:1880/ws/data')
            const wsVideo = new WebSocket('wss://15.165.220.70:1880/ws/video')
            // const wsData = new WebSocket('ws://localhost:1880/ws/data')
            // const wsVideo = new WebSocket('ws://localhost:1880/ws/video')

            wsVideo.onmessage = function (event) {
                console.log('received: ', event.data)
            }
            
            function onResults(results) {
                // if (!results.poseLandmarks) {
                //     grid.updateLandmarks([])
                //     return
                // }
                
                canvasCtx.save()
                canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)
                // canvasCtx.drawImage(results.segmentationMask, 0, 0,
                //                     canvasElement.width, canvasElement.height)
                
                // Only overwrite existing pixels.
                // canvasCtx.globalCompositeOperation = 'source-in'
                // canvasCtx.fillStyle = '#00FF00'
                // canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height)
                
                // Only overwrite missing pixels.
                canvasCtx.globalCompositeOperation = 'destination-atop'
                canvasCtx.drawImage(
                    results.image, 0, 0, canvasElement.width, canvasElement.height)
                
                canvasCtx.globalCompositeOperation = 'source-over'
                drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                                {color: '#00FF00', lineWidth: 4})
                drawLandmarks(canvasCtx, results.poseLandmarks,
                                {color: '#FF0000', lineWidth: 2})
                canvasCtx.restore()
                
                if (results.poseLandmarks) {
                    // console.log('websocket sending..')
                    if (wsData.readyState === 1) {
                        wsData.send(JSON.stringify(results.poseLandmarks))
                    }
                        
                    if (wsVideo.readyState === 1) {
                        canvasElement.toBlob(function (blob) {
                            console.log('blob send')
                            wsVideo.send(JSON.stringify({data: 'blob'}) + "\n\n")
                            // wsVideo.send(blob)
                        })
                    }
                }
                                
                // grid.updateLandmarks(results.poseWorldLandmarks)
            }
            
            const pose = new Pose({locateFile: (file) => {
                return 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/' + file
            }})
            
            pose.setOptions({
                modelComplexity: 1,
                smoothLandmarks: true,
                enableSegmentation: true,
                smoothSegmentation: true,
                minDetectionConfidence: 0.5,
                minTrackingConfidence: 0.5
            })
            
            pose.onResults(onResults)
            
            // const camera = new Camera(videoElement, {
            //     onFrame: async () => {
            //         await pose.send({image: videoElement})
            //     },
            //     width: 1280,
            //     height: 720
            // })
            // camera.start()
            
            
            function render() {
                pose.send({ image: videoElement })
            
                // console.log('rendering..')
                // if (wsData.readyState === 1) {
                //     wsData.send(JSON.stringify({'time': new Date()}))
                // }
            }
            
            const constraints = {
                audio: false, // if you want test audio, give the value 'true'.
                video: { width: 1280, height: 720 }
            }
            
            navigator.mediaDevices.getUserMedia(constraints)
                .then(stream => {
                    videoElement.srcObject = stream
                    videoElement.onloadedmetadata = function(e) {
                        videoElement.play()
                            .then(() => {
                                startVideo(videoElement, render)
                            })
                    }
                })
                .catch(err => {
                    console.log(err)
                })
            
            
            // render()
            
            // videoElement.onloadeddata = function () {
            //     startVideo(videoElement, render)
            // }
            
            // setTimeout(() => {
            //     startVideo(videoElement, render)
            // }, 3000)
            
            // const btn = document.getElementById('start-btn')
            // btn.onclick = function() {
            //     startVideo(videoElement, render)
            // }
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

