module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);

  function SoopTextNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    // const group = RED.nodes.getNode(config.group);
    // if (!group) {
    //   return;
    // }
    // const tab = RED.nodes.getNode(group.config.tab);
    // if (!tab) {
    //   return;
    // }

    const group = "";
    let state = {
      nodeId: config.id,
      nodeType: config.type,
      group: group,
      size: [parseInt(config.width), parseInt(config.height), parseInt(config.widgetX), parseInt(config.widgetY)],
      name: config.name,
      time: "",
      label: config.label,
      format: config.format,
      layout: config.layout,
      fontSize: config.fontSize,
      value: config.value,
    };

    node.on("input", function (msg) {
      let form = config.format.replace(/{{/g, "").replace(/}}/g, "").replace(/\s/g, "") || "_zzz_zzz_zzz_";
      if (form.split(".")[0] != "msg") return;

      form = form.split(".")[1];
      let value = RED.util.getMessageProperty(msg, form);
      if (value !== undefined) state.value = value;

      dashboard.emitState(state);
    });

    dashboard.addNode({
      node: node,
    });
  }
  RED.nodes.registerType("soop_text", SoopTextNode);
};
