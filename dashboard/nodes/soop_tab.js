module.exports = function (RED) {
  function TabNode(config) {
    const node = this;
    RED.nodes.createNode(this, config);
    this.config = {
      name: config.name,
      includedGroups: config.includedGroups,
      includedGroupsName: config.includedGroupsName,
    };
  }

  RED.nodes.registerType("soop_tab", TabNode);
};
