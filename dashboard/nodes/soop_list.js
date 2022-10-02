module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);

  function SoopListNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    // var group = RED.nodes.getNode(config.group);
    // if (!group) {
    //   return;
    // }
    // var tab = RED.nodes.getNode(group.config.tab);
    // if (!tab) {
    //   return;
    // }

    const group = "";
    let state = {
      nodeId: node.id,
      nodeType: config.type,
      group: group,
      size: [parseInt(config.width), parseInt(config.height), parseInt(config.widgetX), parseInt(config.widgetY)],
      name: config.name,
      time: "",
      label: config.label,
      tooltip: config.tooltip,
      listType: config.listType,
      options: config.options,
    };

    node.on("input", function (msg) {
      if (msg.payload.length != 0) {
        state.options = [];
        msg.payload.forEach(function (v) {
          let o = {
            value: v,
          };
          state.options.push(o);
        });
      }
      dashboard.emitState(state);
    });

    dashboard.addNode({
      node: node,
    });
  }
  RED.nodes.registerType("soop_list", SoopListNode);
};
