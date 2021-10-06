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