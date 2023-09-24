"use-strict";

module.exports = function(RED) {
    require('../../static-server')(RED);

    function webcamYoloNode(config) {
        RED.nodes.createNode(this, config)
        const node = this;
        
        function HTML() {
            return require('./webcam-html.js').code(config)
        }
        
        node.on('input', (msg, send, done) => {        
            msg.payload = HTML()
            send = send || function() { this.send.apply(this, arguments )}
            send(msg)
        })
    }

    RED.nodes.registerType("webcam-object-detection", webcamYoloNode)
}
