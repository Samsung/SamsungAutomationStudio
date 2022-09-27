module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);

  function SwitchNode(config) {
    const node = this;
    RED.nodes.createNode(node, config);

    dashboard.addNode({
      node: node,
      onMessage: (message) => {
        node.send({
          payload: message.switchState,
        });
      },
    });
  }

  RED.nodes.registerType("soopSwitch", SwitchNode);
};
