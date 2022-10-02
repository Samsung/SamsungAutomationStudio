module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);

  function SoopSliderNode(config) {
    // Node-specific code
    RED.nodes.createNode(this, config);

    var node = this;

    // var group = RED.nodes.getNode(config.group);
    // if (!group) {
    //   return;
    // }
    // var tab = RED.nodes.getNode(group.config.tab);
    // if (!tab) {
    //   return;
    // }

    // Add node information & event listener from dashboard
    dashboard.addNode({
      node: node,
      onMessage: message => {
        node.send({
          payload: message.value,
        });
      },
    });

    // Receive msg from upstream node in a flow
    node.on("input", function (msg) {
      if (config.pass) {
        state.payload = Math.max(config.min, Math.min(config.max, parseInt(msg.payload)));
        dashboard.emitState(state);
      }
    });
  }
  RED.nodes.registerType("soop_slider", SoopSliderNode);
};
