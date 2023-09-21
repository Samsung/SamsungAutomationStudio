module.exports = function (RED) {
  RED.nodes.registerType("config", moduleflows);
  function moduleflows(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.on("input", function (msg) {
      node.send(msg);
    });
  }
};
