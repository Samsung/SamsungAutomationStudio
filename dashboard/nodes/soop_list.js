module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);
  const { SOOP_NODE_TYPE } = require("../common/common");

  function SoopListNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on("input", function (msg) {
      let options = [];
      if (msg.payload.length != 0) {
        msg.payload.forEach(function (v) {
          options.push({ value: v });
        });
      } else {
        options = config.options;
      }
      dashboard.emitAndUpdateState({
        nodeId: node.id,
        options: options,
      });
    });

    dashboard.addNode({
      node: node,
    });
  }
  RED.nodes.registerType(SOOP_NODE_TYPE.LIST, SoopListNode);
};
