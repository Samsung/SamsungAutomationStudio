module.exports = function(RED) {

    function TabNode(config) {
        RED.nodes.createNode(this, config);
        this.config = {
            name: config.name,
            includedGroups: config.includedGroups
        };
    }

    RED.nodes.registerType("soop_tab", TabNode);
};