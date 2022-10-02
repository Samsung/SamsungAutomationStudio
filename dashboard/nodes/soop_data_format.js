module.exports = function (RED) {
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
  RED.nodes.registerType("soop_data_format", SoopDataFormatNode);
};
