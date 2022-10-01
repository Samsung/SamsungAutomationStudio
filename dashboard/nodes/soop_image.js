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

        // Add node information
        dashboard.addNode({
            node: node,
            onMessage: (message) => {
              console.log(message);
            },
        });

        // Send runtime information to dashboard
        dashboard.emitState({
            nodeId: node.id,
            nodeType: config.type,
            group: config.group, // need to revise
            size: [], // need to revise
            name: config.name,
            tooltip: config.tooltip,
            option: config.source,
            resource: config.source == "upload" ? config.uploads : config.link,
            fit: config.fits,
        });
    }
    RED.nodes.registerType("soop_image", SoopImageNode);
};
