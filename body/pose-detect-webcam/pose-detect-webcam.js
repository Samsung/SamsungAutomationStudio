"use strict"


module.exports = function(RED) {

    function PoseDetectWebcamNode(config) {
        function HTML() {
            return require('./pose-webcam-html.js').code(config)
        }

        RED.nodes.createNode(this, config)
        
        // listener to receive messages from the up-stream nodes in a flow.
        this.on('input', (msg, send, done) => {

            // return HTML document to the client.
            // 클라이언트에 HTML 문서 반환
            msg.payload = HTML()
            send = send || function() { this.send.apply(this, arguments )}
            send(msg)
        })
    }
    RED.nodes.registerType("pose-detect-webcam", PoseDetectWebcamNode)
}

