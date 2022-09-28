module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);

  function SoopListNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    var group = RED.nodes.getNode(config.group);
    if (!group) {
      return;
    }
    var tab = RED.nodes.getNode(group.config.tab);
    if (!tab) {
      return;
    }

    let state = {
      nodeId: config.id,
      nodeType: config.type,
      group: config.group,
      size: [config.width, config.height],
      name: config.name,
      time: "",
      label: config.label,
      tooltip: config.tooltip,
      listType: config.listType,
      options: config.options,
    };

    node.on("input", function (msg) {
      if (msg.payload.length != 0) {
        if (state.nodeType == "checkbox") {
          state.nodeType = "ol";
        }
        state.options = [];
        msg.payload.forEach(function (v) {
          let o = {
            value: v,
          };
          state.options.push(o);
        });
      }
    });

    dashboard.emitState(state);

    dashboard.addNode({
      node: node,
      onMessage: message => {
        // console.log(message);
        // node.send("received message from a dashboard");
        this.state.options = message.options;
      },
    });
  }
  RED.nodes.registerType("soop_list", SoopListNode);
};
