module.exports = function (RED) {
  function GroupNode(config) {
    RED.nodes.createNode(this, config);
    this.config = {
      name: config.name,
      displayVisible: config.displayVisible,
      groupX: config.x,
      groupY: config.y,
      width: config.width,
      height: config.height,
      order: config.order,
      tab: config.tab,
      groupState: config.groupState,
      includedNodesId: config.includedNodesId,
    };
    if (!this.config.hasOwnProperty("displayVisible")) {
      this.config.displayVisible = true;
    }
    if (this.config.displayVisible !== false) {
      this.config.displayVisible = true;
    }
    for (var i = 0; i < this.config.height; i++) {
      this.config.groupState[i] = new Array(this.config.width);
    }
  }

  RED.nodes.registerType("soop_group", GroupNode);
};
