module.exports = function(RED) {
    // var ui = require('../ui')(RED);
    const dashboard = require("../dashboard")(RED);

    function SoopImageNode(config) {
        // Node Constructor
        RED.nodes.createNode(this, config);

        var node = this;

        // var group = RED.nodes.getNode(config.group);
        // if (!group) { return; }
        // var tab = RED.nodes.getNode(group.config.tab);
        // if (!tab) { return; }

        // Send Runtime information to react
        dashboard.addNode({
            node: node,
            onMessage: (message) => {
              console.log(message);
              node.send("received message from a dashboard");
            },
        });
    }
    RED.nodes.registerType("soop_image", SoopImageNode);
};
