module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);

  function SoopGaugeNode(config) {
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
      nodeId: node.id,
      nodeType: config.type,
      group: config.group,
      size: [parseInt(config.width), parseInt(config.height), parseInt(config.widgetX), parseInt(config.widgetY)],
      name: config.name,
      time: "",
      gType: config.gType,
      label: config.label,
      format: config.format,
      range: [config.min, config.max],
      value: config.min,
      units: config.units,
      color: config.colorPicking,
    };

    node.on("input", function (msg) {
      let form = config.format.replace(/{{/g, "").replace(/}}/g, "").replace(/\s/g, "") || "_zzz_zzz_zzz_";

      if (form.split(".")[0] != "msg") return;
      form = form.split(".")[1];
      let value = RED.util.getMessageProperty(msg, form);
      if (value !== undefined) {
        if (!isNaN(parseFloat(value))) {
          value = parseFloat(value);
        }
      } else {
        if (!isNaN(parseFloat(msg.payload))) {
          value = parseFloat(msg.payload);
        }
      }
      state.value = value;
      dashboard.emitState(state);
    });
  }
  RED.nodes.registerType("soop_gauge", SoopGaugeNode);
};
