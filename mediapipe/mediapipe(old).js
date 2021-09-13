// The node .js file defines the runtime behavior of the node.

// import { LandmarkGrid } from '@mediapipe/control_utils_3d'
module.exports = function(RED) {

  function HTML() {
    var html = String.raw`
<!-- CDNs -->
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils_3d/control_utils_3d.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js" crossorigin="anonymous"></script>

<div class="container">
  <p class="test_p"></p>
  <video class="input_video"></video>
  <canvas class="output_canvas" width="1280px" height="720px"></canvas>
  <!-- <div class="landmark-grid-container"></div> -->
</div>
    `
    return html
  }
  
  function MediapipeNode(config) {
    try {
      var ui = RED.require("node-red-dashboard")(RED)
      
      RED.nodes.createNode(this, config)
      
      var done = ui.addWidget({
        node: this,                             // *REQUIRED*
        format: HTML(),                         // *REQUIRED*
        group: config.group,                    // *REQUIRED*
        order: config.order,                    // *REQUIRED* placeholder for position in page
        width: config.width,                    // *REQUIRED*
        height: config.height,                  // *REQUIRED*
        templateScope: "local",                 // *REQUIRED*
        emitOnlyNewValues: false,               // *REQUIRED*
        forwardInputMessages: false,            // *REQUIRED*
        storeFrontEndInputAsState: false,       // *REQUIRED*
        convertBack: function (value) {},
        beforeEmit: function (msg, value) {},
        beforeSend: function (msg, orig) {},
        initController: function ($scope, events) {

          const testP = document.getElementsByClassName('test_p')[0];
          testP.innerText = 'hello, there!'

          const videoElement = document.getElementsByClassName('input_video')[0];
          const canvasElement = document.getElementsByClassName('output_canvas')[0];
          const canvasCtx = canvasElement.getContext('2d');
          // const landmarkContainer = document.getElementsByClassName('landmark-grid-container')[0];
          // const grid = new ControlUtils3d.LandmarkGrid(landmarkContainer);
      
          function onResults(results) {
            if (!results.poseLandmarks) {
              grid.updateLandmarks([]);
              return;
            }
          
            canvasCtx.save();
            canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
            canvasCtx.drawImage(results.segmentationMask, 0, 0,
                                canvasElement.width, canvasElement.height);
          
            // Only overwrite existing pixels.
            canvasCtx.globalCompositeOperation = 'source-in';
            canvasCtx.fillStyle = '#00FF00';
            canvasCtx.fillRect(0, 0, canvasElement.width, canvasElement.height);
          
            // Only overwrite missing pixels.
            canvasCtx.globalCompositeOperation = 'destination-atop';
            canvasCtx.drawImage(
                results.image, 0, 0, canvasElement.width, canvasElement.height);
          
            canvasCtx.globalCompositeOperation = 'source-over';
            drawConnectors(canvasCtx, results.poseLandmarks, POSE_CONNECTIONS,
                           {color: '#00FF00', lineWidth: 4});
            drawLandmarks(canvasCtx, results.poseLandmarks,
                          {color: '#FF0000', lineWidth: 2});
            canvasCtx.restore();
          
            // grid.updateLandmarks(results.poseWorldLandmarks);
          }
          
          // const POSE = require('@mediapipe/pose')
          const pose = new Pose({locateFile: (file) => {
            return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
          }});
      
          pose.setOptions({
            modelComplexity: 1,
            smoothLandmarks: true,
            enableSegmentation: true,
            smoothSegmentation: true,
            minDetectionConfidence: 0.5,
            minTrackingConfidence: 0.5
          });
      
          pose.onResults(onResults);
          
          const camera = new Camera(videoElement, {
            onFrame: async () => {
              await pose.send({image: videoElement});
            },
            width: 1280,
            height: 720
          });
      
          camera.start();

        }
      })
    } catch (e) {
      console.warn(e)
    }

    this.on('close', function() {
      if (done) { done() }
    })
  }

  RED.nodes.registerType("mediapipe", MediapipeNode)
}