"use-strict";

module.exports = function(RED) {
    require('../../static-server')(RED);

    function webcamYoloNode(config) {
        RED.nodes.createNode(this, config)
        const node = this;
        
        function HTML() {
            console.log("HTML()의 config: ", config);
            return require('./webcam-html.js').code(config)
        }
        
          
        console.log('webcamYoloNode의 config')
        console.log(config);
        
        node.on('input', (msg, send, done) => {
            console.log('==============msg============');
            console.log(msg);
        
            msg.payload = HTML()
            send = send || function() { this.send.apply(this, arguments )}
            send(msg)
        })
    }
    
    RED.nodes.registerType("webcam-object-detection", webcamYoloNode)
}
