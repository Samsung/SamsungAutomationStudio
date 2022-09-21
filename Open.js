const { time } = require('console');

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = function (RED) {

    function MediapipeOpen(config){
        const mediapipeGlobalConfig = require('./MediapipeConfig.js');
        const util = require('util');
        const exec = util.promisify(require('child_process').exec);

        const node = this;
        
        RED.nodes.createNode(node, config);
        mediapipeGlobalConfig.openNode = this;
        node.on("input", async function (msg) {
            try {
                
                mediapipeGlobalConfig.pid = exec(`python ./mediapipe/main.py`);
                await sleep(4000);
                
                mediapipeGlobalConfig.client.on('data', function(data) {
                    
                    msg.payload = data.toString();
                    if(mediapipeGlobalConfig.mediapipeEnable){
                        mediapipeGlobalConfig.holisticNode.send(msg);
                    }else{
                        mediapipeGlobalConfig.mediapipeEnable = true;
                        mediapipeGlobalConfig.openNode.send(msg);
                    }
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