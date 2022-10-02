module.exports = function (RED) {
  var dashboard = require("../dashboard")(RED);

  function DropdownNode(config) {
    RED.nodes.createNode(this, config);
    this.multiple = config.multiple || false;
    this.state = [" ", " "];
    var node = this;

    // var group = RED.nodes.getNode(config.group);
    // if (!group) {
    //   return;
    // }
    // var tab = RED.nodes.getNode(group.config.tab);
    // if (!tab) {
    //   return;
    // }

    const group = "";
    var control = {
      nodeId: node.id,
      nodeType: "dropdown",
      group: group,
      size: [parseInt(config.width), parseInt(config.height), parseInt(config.widgetX), parseInt(config.widgetY)],
      label: config.label,
      tooltip: config.tooltip,
      name: config.name || "",
      time: "",
    };

    for (var o = 0; o < config.options.length; o++) {
      config.options[o].label = config.options[o].label || config.options[o].value;
    }
    control.options = config.options;

    node.on("input", function (msg) {
      dashboard.emitState({
        nodeId: node.id,
        key: msg.payload,
      });
    });

    dashboard.addNode({
      node: node,
      onMessage: message => {
        node.send({
          payload: message.value,
        });
      },
    });
  }
  RED.nodes.registerType("soop_dropdown", DropdownNode);
};
