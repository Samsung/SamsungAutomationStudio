module.exports = function (RED) {
  RED.nodes.registerType("submodule", submodule);
  function submodule(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    node.on("input", function (msg) {
      node.send(msg);
    });
  }
};
