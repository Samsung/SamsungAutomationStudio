

module.exports = function (RED) {
    function MediapipeClose(config){
        const mediapipeGlobalConfig = require('./MediapipeConfig.js');
        const mediapipeFunction = require('./MediapipeFunction.js');
        const node = this;
        RED.nodes.createNode(node, config);
        mediapipeGlobalConfig.closeNode = this;
        node.on("input", function (msg){
            try {
                if(!mediapipeGlobalConfig.mediapipeEnable){
                    console.log("Mediapipe is not set.");
                    return;
                }

                const requestData = {
                    command : "close"
                }
                mediapipeGlobalConfig.queue.push(JSON.stringify(requestData));
                
                if(!mediapipeGlobalConfig.running) mediapipeFunction.send();
            
                // Sending result is handled together by MediapipeFunction.js/setEventHandler
                // node.send(msg.payload);

            } catch (error) {
                console.log(error);
                msg.payload = 'fail : ' + String(error);
                node.send(msg);
            }
        })
    }

    RED.nodes.registerType("close", MediapipeClose, {});
}