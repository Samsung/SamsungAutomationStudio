"use strict"

const path = require('path')

module.exports = function(RED) {

    // The node .js file defines the runtime behavior of the node.

    function PoseDetectionNode(config) {

        function HTML() {
          const html = String.raw`

          <!DOCTYPE html>
<html>

<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils_3d/control_utils_3d.js"
    crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
  <script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" crossorigin="anonymous"></script>
  <title>Pose Detection</title>
  <style>
    
    table {
      width: 100%;
      border-collapse: collapse;
    }
    th, td {
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
  /* motion regist timer */
  const timerSecond = document.getElementById("secondTimer");
  var second = timerSecond.options[timerSecond.selectedIndex].value;
  console.log(second);

  document.getElementById("secondTimer").addEventListener('change', function () {
    second = timerSecond.options[timerSecond.selectedIndex].value;
    console.log(second);
  })

  /* motion name empty check*/
  var poseMotionName = document.getElementById("pose-motion-name");
  var poseData = null
  document.getElementById("regist-btn").addEventListener('click', function () {
    if (poseMotionName.value === "" || poseMotionName.value === undefined) {
      document.getElementById("motion-result-message").style.color = "red";
      document.getElementById("motion-result-message").textContent = "[Fail] Invalid Motion-Name";
      document.getElementsByClassName("capture_canvas")[0].style.display = "none";
      document.getElementById("result-div").style.display = "block";
    } else {
      onCapture(poseMotionName.value);
    }

    document.getElementById("pose-motion-name").value = "";
  })

  const videoElement = document.getElementsByClassName('input_video')[0]
  const canvasElement = document.getElementsByClassName('output_canvas')[0]
  const captureElement = document.getElementsByClassName('capture_canvas')[0];
  const canvasCtx = canvasElement.getContext('2d')
  const captureCtx = captureElement.getContext('2d');

  const ws = new WebSocket('ws://localhost:1880/ws/mediapipe')

  function onCapture(motionName) {
    setTimeout((motionName) => {
      motionRegister(motionName);

      captureCtx.drawImage(canvasElement, 0, 0, captureElement.width, captureElement.height);    
      var detail = "";
      const fixed = 5;

      // hands motion keypoint data table
        
      detail += "<table style='display:inline;margin:0px 5px;'>";
      detail += "<caption>Estimated Pose</caption>";
      detail += "<tr><th></th><th>x</th><th>y</th><th>z</th><th>visibility</th></tr>";
      //(visibility:"+poseData[idx].visibility.toFixed(fixed)+")
      for (let idx = 0; idx < poseData.length; idx++) {
        detail += "<tr>";
        detail += "<td align='center'>"+idx+"</td>";
        detail += "<td>"+poseData[idx].x.toFixed(fixed)+"</td>"
        detail += "<td>"+poseData[idx].y.toFixed(fixed)+"</td>"
        detail += "<td>"+poseData[idx].z.toFixed(fixed)+"</td>"
        detail += "<td>"+poseData[idx].z.toFixed(fixed)+"</td>"
        detail += "</tr>";
      }
      detail += "</table>";
        
      document.getElementById("motion-result-keypoint").innerHTML = '<br><b>' + motionName + "</b> Motion Detail <br>" + detail;
      document.getElementById("motion-result-message").style.color = "green";
      document.getElementById("motion-result-message").textContent = "Regist Success! You can used [" + motionName + "] motion";
      document.getElementsByClassName("capture_canvas")[0].style.display = "block";
      document.getElementById("pose-motion-name").value = "";
      document.getElementById("result-div").style.display = "block";

    }, document.getElementById("secondTimer").value * 1000, motionName);
  }

  function motionRegister(motionName) {
    var result = $.post("regist", { "name": motionName, "keypoints": poseData }, function (data) {
      alert("success");
    }).done(function () {
      alert("second success");
    }).fail(function () {
      alert("error");
    })
  };

  function onResults(results) {

    canvasCtx.save()
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height)
    canvasCtx.globalCompositeOperation = 'destination-atop'
    canvasCtx.drawImage(
      results.image, 0, 0, canvasElement.width, canvasElement.height)

    canvasCtx.globalCompositeOperation = 'source-over'
    drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
      { color: '#00FF00', lineWidth: 4 })
    drawLandmarks(canvasCtx, results.poseLandmarks,
      { color: '#FF0000', lineWidth: 2 })
    canvasCtx.restore()

    if (results.poseLandmarks) {
      poseData = results.poseLandmarks
      ws.send(JSON.stringify(results.poseLandmarks))
    }
  }

  const pose = new Pose({
    locateFile: (file) => {
      return 'https://cdn.jsdelivr.net/npm/@mediapipe/pose/' + file
    }
  })

  pose.setOptions({
    modelComplexity: 1,
    smoothLandmarks: true,
    enableSegmentation: true,
    smoothSegmentation: true,
    minDetectionConfidence: 0.5,
    minTrackingConfidence: 0.5
  })

  pose.onResults(onResults)

  const camera = new Camera(videoElement, {
    onFrame: async () => {
      await pose.send({ image: videoElement })
    },
    width: 1280,
    height: 720
  })
  camera.start()
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
        this.send({ payload: 'this is message from PoseDetectionNode' })
    
        // 다른 플로우가 배포되면, 기존의 노드들은 삭제됩니다.
        // 이 삭제를 리스닝해서 무언가를 해야 한다면 아래처럼 하면 됩니다.
        this.on('close', function() {
        // do something
        })
    }
    RED.nodes.registerType("node-red-contrib-pose-detection", PoseDetectionNode)
}

