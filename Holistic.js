const mediapipeGlobalConfig = require('./MediapipeConfig.js');

module.exports = function (RED) {
    function Holistic(config){
        const node = this;
        RED.nodes.createNode(node, config);

        node.on("input", async function (msg) {
            mediapipeGlobalConfig.client.write(msg.payload);
            print(1);
            // node.status(200).send(msg);
            // node.error(e);
        });
    }

    RED.nodes.registerType("holistic", Holistic, {});
}