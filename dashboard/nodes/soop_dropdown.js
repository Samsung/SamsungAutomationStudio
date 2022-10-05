module.exports = function (RED) {
  var dashboard = require("../dashboard")(RED);
  const { SOOP_NODE_TYPE } = require("../common/common");

  function DropdownNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    var valueMap = new Map();
    var reverseValueMap = new Map();
    for (var i = 0; i < config.options.length; i++) {
      let option = config.options[i];
      valueMap.set(option.value, i);
      reverseValueMap.set(i, option.value);
    }

    node.on("input", function (msg) {
      let value = valueMap.get(msg.payload);
      if (!value) value = 0;
      dashboard.emitAndUpdateState({
        nodeId: node.id,
        value: value,
      });
    });

    dashboard.addNode({
      node: node,
      onMessage: message => {
        let value = reverseValueMap.get(message.value);
        if (!value) reverseValueMap.get(0);

        dashboard.emitAndUpdateState({
          nodeId: node.id,
          value: valueMap.get(value),
        });
        node.send({
          payload: value,
        });
      },
    });
  }
  RED.nodes.registerType(SOOP_NODE_TYPE.DROPDOWN, DropdownNode);
};
