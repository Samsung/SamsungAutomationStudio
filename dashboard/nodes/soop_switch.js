module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);
  const { SOOP_NODE_TYPE } = require("../common/common");

  function SwitchNode(config) {
    const node = this;
    RED.nodes.createNode(node, config);

    dashboard.addNode({
      node: node,
      onMessage: message => {
        dashboard.emitAndUpdateState({
          nodeId: node.id,
          switchState: message.switchState,
        });
        node.send({
          payload: message.switchState,
        });
      },
    });
    node.on("input", function (msg) {
      dashboard.emitAndUpdateState({
        nodeId: node.id,
        switchState: msg.payload,
      });
    });
  }

  RED.nodes.registerType(SOOP_NODE_TYPE.SWITCH, SwitchNode);
};
