module.exports = function(RED) {
    const dashboard = require("../dashboard")(RED);

    function SoopImageNode(config) {
        // Node Constructor
        RED.nodes.createNode(this, config);
    }
    RED.nodes.registerType("soop_image", SoopImageNode);
};
