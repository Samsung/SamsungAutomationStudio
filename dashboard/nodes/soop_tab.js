module.exports = function(RED) {
    const dashboard = require("../dashboard")(RED);

    function TabNode(config) {
        const node = this;
        RED.nodes.createNode(this, config);
        this.config = {
            name: config.name,
            includedGroups: config.includedGroups,
            includedGroupsName: config.includedGroupsName
        };
        dashboard.addNode({
            node: node,
        });
    }

    RED.nodes.registerType("soop_tab", TabNode);
};