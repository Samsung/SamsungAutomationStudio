module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);
  const { SOOP_NODE_TYPE } = require("../common/common");

  function TabNode(config) {
    const node = this;
    RED.nodes.createNode(this, config);
    this.config = {
      name: config.name,
      includedGroups: config.includedGroups,
      includedGroupsName: config.includedGroupsName,
    };
    dashboard.addNode({
      node: node,
    });
  }

  RED.nodes.registerType(SOOP_NODE_TYPE.TAB, TabNode);
};
