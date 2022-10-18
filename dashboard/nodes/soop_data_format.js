module.exports = function (RED) {
  const { SOOP_NODE_TYPE } = require("../common/common");

  function SoopDataFormatNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;
    node.on("input", function (msg) {
      RED.util.setMessageProperty(
        msg,
        "label",
        RED.util.evaluateNodeProperty(config.label, config.labelType, node, msg),
        true,
      );
      node.send(msg);
    });
  }
  RED.nodes.registerType(SOOP_NODE_TYPE.FORMAT, SoopDataFormatNode);
};
