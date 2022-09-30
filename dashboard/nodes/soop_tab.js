module.exports = function(RED) {

    function TabNode(config) {
        RED.nodes.createNode(this, config);
        this.config = {
            name: config.name,
        };
    }

    RED.nodes.registerType("soop_tab", TabNode);
};