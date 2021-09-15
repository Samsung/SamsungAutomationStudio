module.exports = function(RED) {

    function HandsDetectionNode(config) {

        function HTML() {
          const html = String.raw`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <script src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js" crossorigin="anonymous"></script>
            <script src="https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js" crossorigin="anonymous"></script>
            <title>Document</title>
          </head>
          <body>
            <video id="my-video" class="input_video" width="480" height="270" crossorigin="anonymous">
              <source src="click.mp4" type="video/mp4">
            </video>
            <canvas id="model-canvas" class="output_canvas" width="480" height="270"></canvas>
          </body>
          <script type="module">
            const videoElement = document.getElementsByClassName('input_video')[0];
            const canvasElement = document.getElementsByClassName('output_canvas')[0];
            const canvasCtx = canvasElement.getContext('2d');
            
            function onResults(results) {
              canvasCtx.save();
              canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
              canvasCtx.drawImage(
                  results.image, 0, 0, canvasElement.width, canvasElement.height);
              if (results.multiHandLandmarks) {
                for (const landmarks of results.multiHandLandmarks) {
                  drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS,
                                {color: '#00FF00', lineWidth: 5});
                  drawLandmarks(canvasCtx, landmarks, {color: '#FF0000', lineWidth: 1});
                  console.log(landmarks);
                }
              }
              canvasCtx.restore();
            }
          
            const hands = new Hands({locateFile: (file) => {
              return 'https://cdn.jsdelivr.net/npm/@mediapipe/hands/'+file;
            }});
            hands.setOptions({
              maxNumHands: 2,
              minDetectionConfidence: 0.5,
              minTrackingConfidence: 0.5
            });
            hands.onResults(onResults);
          
            const camera = new Camera(videoElement, {
              onFrame: async () => {
                await hands.send({image: videoElement});
              },
              width: 480,
              height: 270
            });
            camera.start();
          </script>
          </html>
          `
          return html
        }

        RED.nodes.createNode(this, config)
        
        this.on('input', (msg, send, done) => {
            msg.payload = HTML()
            
            if (done) {
                done()
            }
            
            send = send || function() { this.send.apply(this, arguments )}
            send(msg)
        })
        
        this.send({ payload: 'this is message from HandsDetectionNode' })
        this.on('close', function() {
        })
    }
    RED.nodes.registerType("hands-detection", HandsDetectionNode)
}