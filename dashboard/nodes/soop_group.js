module.exports = function (RED) {
  function GroupNode(config) {
    const node = this;
    RED.nodes.createNode(this, config);
    this.config = {
      name: config.name,
      displayVisible: config.displayVisible,
      groupX: config.groupX,
      groupY: config.groupY,
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
