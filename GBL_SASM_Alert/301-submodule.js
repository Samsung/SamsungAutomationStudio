module.exports = function (RED) {
  RED.nodes.registerType("submodule", submodule);
  function submodule(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    var event = "GBLmodule:" + node.id;
    var event_fun = function (msg) {
      node.receive(msg);
    };
    RED.events.on(event, event_fun);
    this.on("close", function () {
      RED.events.removeListener(event, event_fun);
    });
    this.on("input", function (msg) {
      node.send(msg);
    });
  }
};
