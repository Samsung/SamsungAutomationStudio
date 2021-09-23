"use strict"

const path = require('path')


module.exports = function(RED) {

    // The node .js file defines the runtime behavior of the node.

    function MonitorNode(config) {

        function HTML() {
            const html = String.raw`
            <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <script src="https://cdn.socket.io/4.1.2/socket.io.min.js" integrity="sha384-toS6mmwu70G0fw54EGlWWeA4z3dyJ+dlXBtSURSKN4vyRFOcxd3Bzjj/AoOwY+Rg" crossorigin="anonymous"></script>
</head>
<body>

  <img id="video" src="" />

  <script>

    // there should be no IP or port in parameter.
    // https://stackoverflow.com/questions/24526166/socketio-err-connection-refused
    // const socketClient = io();
    const socketClient = io('http://localhost:1881');
    const videoElem = document.getElementById('video');

    socketClient.on("connect", () => {
        console.log("connection server");

        socketClient.emit("echo", "echo from monitor")
    });

    socketClient.on("video", (msg) => {
        // console.log('blob received')
        videoElem.src = msg;
    })
  </script>
</body>
</html>
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
        this.send({ payload: 'this is message from MonitorNode' })
    
        // 다른 플로우가 배포되면, 기존의 노드들은 삭제됩니다.
        // 이 삭제를 리스닝해서 무언가를 해야 한다면 아래처럼 하면 됩니다.
        this.on('close', function() {
            // do something
        })
    }
    RED.nodes.registerType("monitor", MonitorNode)
}

