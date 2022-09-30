module.exports = function (RED) {
    function Holistic(config){
        const node = this;
        RED.nodes.createNode(node, config);
        const mediapipeGlobalConfig = require('./MediapipeConfig.js');
        mediapipeGlobalConfig.holisticNode = this;
        node.on("input", function (msg) {
            mediapipeGlobalConfig.queue.push(msg.payload);

            // if send function is Not working, Start send;
            if(!mediapipeGlobalConfig.running){
                mediapipeGlobalConfig.send();
            }

            // Sending result is handled together by Open.js.
            // node.send(msg.payload);
        });
    }

    RED.nodes.registerType("holistic", Holistic, {});
}