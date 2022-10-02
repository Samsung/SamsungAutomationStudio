module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);

  function SoopTextNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on("input", function (msg) {
      let form = config.format.replace(/{{/g, "").replace(/}}/g, "").replace(/\s/g, "") || "_zzz_zzz_zzz_";
      if (form.split(".")[0] != "msg") return;

      form = form.split(".")[1];
      let value = RED.util.getMessageProperty(msg, form);
      if (value == undefined) value = "";

      dashboard.emitState({
        nodeId: node.id,
        value: value,
      });
    });

    dashboard.addNode({
      node: node,
    });
  }
  RED.nodes.registerType("soop_text", SoopTextNode);
};
