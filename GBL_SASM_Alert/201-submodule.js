module.exports = function (RED) {
  RED.nodes.registerType("submoduleflows", submoduleflows);
  function submoduleflows(config) {
    RED.nodes.createNode(this, config);
    var node = this;

    var event = "GBLmodule:" + node.id;
    var event_fun = function (msg) {
      node.receive(msg);
    };
    RED.events.on(event, event_fun);

    var node_text_event = "GBLtext:" + node.id;
    var node_text_event_fun = function (status) {
      node.status(status);
    };
    RED.events.on(node_text_event, node_text_event_fun);

    this.on("close", function () {
      RED.events.removeListener(event, event_fun);
      RED.events.removeListener(node_text_event, node_text_event_fun);
    });
    this.on("input", function (msg) {
      node.send(msg);
    });
  }
};
