module.exports = function (RED) {
  const { SOOP_NODE_TYPE } = require("../common/common");

  function DashboardNode(config) {
    const node = this;
    RED.nodes.createNode(node, config);
  }

  RED.nodes.registerType(SOOP_NODE_TYPE.CONFIG, DashboardNode);
};
