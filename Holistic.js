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
            // mediapipeGlobalConfig.client.write(msg.payload);
            // node.status(200).send(msg);
            // node.error(e);
        });
    }

    RED.nodes.registerType("holistic", Holistic, {});
}