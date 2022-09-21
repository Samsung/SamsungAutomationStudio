module.exports = function (RED) {

    function MediapipeOpen(config){
        const mediapipeGlobalConfig = require('./MediapipeConfig.js');
        const util = require('util');
        const exec = util.promisify(require('child_process').exec);

        const node = this;
        RED.nodes.createNode(node, config);
        
        node.on("input", function (msg) {
            try {
                
                mediapipeGlobalConfig.pid = exec(`python ./mediapipe/main.py`);
                
                mediapipeGlobalConfig.client.on('data', function(data) {
                    msg.payload = data;
                    node.send(msg);
                });

                mediapipeGlobalConfig.client.connect(1881, '127.0.0.1', function() {
                    mediapipeGlobalConfig.client.write('sendTest');
                });
            } catch (error) {
                console.log(error);
                msg.payload = 'fail';
            }

            node.send(msg);
        });
    }

    RED.nodes.registerType("open", MediapipeOpen, {});
}