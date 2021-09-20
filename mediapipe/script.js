function startVideo(canvasDom, render_func) {
    
    // var canvas = canvasDom.cloneNode()
    // var ctx = canvas.getContext('2d')

    // render_func()

    var fps = 60
    var stopAnim = audioTimerLoop(render_func, 1000 / fps)

    setTimeout(function() {
        stopAnim()
    }, 5000)
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
// // const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0]
// // const grid = new LandmarkGrid(landmarkContainer)

// // const ws = new WebSocket('wss://15.165.220.70:1880/ws/mediapipe')
const ws = new WebSocket('ws://localhost:1880/ws/mediapipe')

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
    
    if (results.poseLandmarks && ws.readyState === 1) {
        // console.log('websocket sending..')
        ws.send(JSON.stringify(results.poseLandmarks))
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



const constraints = {
    audio: false, // if you want test audio, give the value 'true'.
    video: { width: 1280, height: 720 }
}

navigator.mediaDevices.getUserMedia(constraints)
    .then(stream => {
        videoElement.srcObject = stream
        videoElement.onloadedmetadata = function(e) {
            videoElement.play()
        }
    })
    .catch(err => {
        console.log(err)
    })

function render() {
    pose.send({image: videoElement})

    // console.log('rendering..')
    // if (ws.readyState === 1) {
    //     ws.send(JSON.stringify({'time': new Date()}))
    // }
}

// render()

const btn = document.getElementById('start-btn')
btn.onclick = function() {
    startVideo(videoElement, render)
}