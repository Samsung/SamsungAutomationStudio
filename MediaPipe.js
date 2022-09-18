module.exports = function (RED) {
    function Pass(config){
        const node = this;
        RED.nodes.createNode(node, config);
        this.py = require('./mediapipe/py');

        node.on("input", async function (msg) {
            msg.payload = await this.py.detection();

            node.send(msg);
            // node.status(200).send(msg);
            // node.error(e);
        });
    }
    RED.nodes.registerType("mediapipe", Pass, {});
}