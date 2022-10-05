module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);
  const { SOOP_NODE_TYPE } = require("../common/common");

  function SoopImageNode(config) {
    // Node Constructor
    RED.nodes.createNode(this, config);

    var node = this;

    // Add node information & event listener from dashboard
    dashboard.addNode({
      node: node,
    });

    // Receive msg from upstream node in a flow
    node.on("input", function (msg) {
      dashboard.emitAndUpdateState({
        nodeId: node.id,
        value: msg.payload,
      });
    });
  }
  RED.nodes.registerType(SOOP_NODE_TYPE.IMAGE, SoopImageNode);
};
