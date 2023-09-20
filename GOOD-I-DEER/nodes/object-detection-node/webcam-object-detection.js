"use-strict";

module.exports = function(RED) {
    const path = require('path');

    function webcamYoloNode(config) {
        RED.nodes.createNode(this, config)
        const node = this;
        
        function HTML() {
            config.aa = 'testes';
            return require('./webcam-html.js').code(config)
        }
        
          
        console.log('webcamYoloNode의 config')
        console.log(config);
        
        // on input event
        node.on('input', (msg, send, done) => {
            console.log('==============msg============');
            console.log(msg);
        
            // return HTML document to client
            msg.payload = HTML()
            send = send || function() { this.send.apply(this, arguments )}
            send(msg)
        })

        // flow closed
    }
    RED.nodes.registerType("webcam-object-detection", webcamYoloNode)
}
