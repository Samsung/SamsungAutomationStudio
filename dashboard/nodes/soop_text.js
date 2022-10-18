module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);
  const { SOOP_NODE_TYPE } = require("../common/common");

  function SoopTextNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on("input", function (msg) {
      let labelForm = config.labelFormat.replace(/{{/g, "").replace(/}}/g, "").replace(/\s/g, "") || "_zzz_zzz_zzz_";
      let valueForm = config.valueFormat.replace(/{{/g, "").replace(/}}/g, "").replace(/\s/g, "") || "_zzz_zzz_zzz_";
      let labelParam = RED.util.normalisePropertyExpression(labelForm);
      let valueParam = RED.util.normalisePropertyExpression(valueForm);

      let label = config.label;
      let value = config.value;

      if (labelParam.length > 1) {
        label = msg;
        for (var i = 1; i < labelParam.length; i++) {
          label = RED.util.getMessageProperty(label, labelParam[i]);
        }
        if (!label) label = config.label;
      }
      if (valueParam.length > 1) {
        value = msg;
        for (var i = 1; i < valueParam.length; i++) {
          value = RED.util.getMessageProperty(value, valueParam[i]);
        }
        if (!value) value = config.value;
      }

      dashboard.emitAndUpdateState({
        nodeId: node.id,
        label: label,
        value: value,
      });
    });

    dashboard.addNode({
      node: node,
    });
  }
  RED.nodes.registerType(SOOP_NODE_TYPE.TEXT, SoopTextNode);
};
