module.exports = function (RED) {
    function Holistic(config){
        const mediapipeGlobalConfig = require('./MediapipeConfig.js');
        const mediapipeFunction = require('./MediapipeFunction.js');

        const node = this;
        RED.nodes.createNode(node, config);
        mediapipeGlobalConfig.holisticNode = node;
        node.path = config.path;
        node.on("input", function (msg) {
            try {
                if(!mediapipeGlobalConfig.mediapipeEnable){
                    console.log("Mediapipe is not set.");
                    return;
                }
    
                const requestData = {
                    command : "holistic",
                    path : ((node.path === "") ? msg.payload : node.path),
                    result : "array"
                }
    
                mediapipeGlobalConfig.queue.push(JSON.stringify(requestData));
    
                // if send function is Not working, Start send;
                if(!mediapipeGlobalConfig.running) mediapipeFunction.send();
                
                // Sending result is handled together by MediapipeFunction.js/setEventHandler
                // node.send(msg.payload);
            } catch (error) {
                console.log(error);
                msg.payload = 'fail : ' + String(error);
                node.send(msg);
            }
            
        });
    }

    RED.nodes.registerType("holistic", Holistic, {});
}