module.exports = function (RED) {
    function Holistic(config){
        const node = this;
        RED.nodes.createNode(node, config);
        const mediapipeGlobalConfig = require('./MediapipeConfig.js');
        mediapipeGlobalConfig.holisticNode = this;
        node.on("input", async function (msg) {
            mediapipeGlobalConfig.client.write(msg.payload);
            // node.status(200).send(msg);
            // node.error(e);
        });
    }

    RED.nodes.registerType("holistic", Holistic, {});
}