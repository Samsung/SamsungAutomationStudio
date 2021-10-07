"use strict"


module.exports = function(RED) {

    function HandDetectWebcamNode(config) {

        function HTML() {
            return require('./hand-webcam-html.js').code(config)
        }

        RED.nodes.createNode(this, config)
        
        // listener to receive messages from the up-stream nodes in a flow.
        this.on('input', (msg, send, done) => {
            msg.payload = HTML()
            send = send || function() { this.send.apply(this, arguments )}
            send(msg)
        })
    }
    RED.nodes.registerType("hand-detect-webcam", HandDetectWebcamNode)
}