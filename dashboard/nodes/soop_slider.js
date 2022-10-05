module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);
  const { SOOP_NODE_TYPE } = require("../common/common");

  function SoopSliderNode(config) {
    // Node-specific code
    RED.nodes.createNode(this, config);

    var node = this;

    // Add node information & event listener from dashboard
    dashboard.addNode({
      node: node,
      onMessage: message => {
        dashboard.emitAndUpdateState({
          nodeId: node.id,
          value: message.value,
        });
        node.send({
          payload: message.value,
        });
      },
    });

    // Receive msg from upstream node in a flow
    node.on("input", function (msg) {
      if (config.pass && !isNaN(parseInt(msg.payload))) {
        dashboard.emitAndUpdateState({
          nodeId: node.id,
          value: Math.max(config.min, Math.min(config.max, parseInt(msg.payload))),
        });
      }
    });
  }
  RED.nodes.registerType(SOOP_NODE_TYPE.SLIDER, SoopSliderNode);
};
