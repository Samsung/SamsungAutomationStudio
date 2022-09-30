

module.exports = function (RED) {
    function MediapipeClose(config){
        const mediapipeGlobalConfig = require('./MediapipeConfig.js');
        const node = this;
        RED.nodes.createNode(node, config);
        node.on("input", function (msg){
            try {
                const requestData = {
                    command : "close"
                }
                mediapipeGlobalConfig.queue.push(JSON.stringify(requestData));

                if(!mediapipeGlobalConfig.running){
                    mediapipeGlobalConfig.send();
                    mediapipeGlobalConfig.mediapipeEnable = false;
                    
                }
                msg.payload = 'success';
            } catch (error) {
                console.log(error);
                msg.payload = 'fail';
            }
            node.send(msg);
        })
    }

    RED.nodes.registerType("close", MediapipeClose, {});
}