module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);

  function SoopListNode(config) {
    RED.nodes.createNode(this, config);
    const node = this;

    node.on("input", function (msg) {
      let options = [];
      if (msg.payload.length != 0) {
        msg.payload.forEach(function (v) {
          let o = {
            value: v,
          };
          options.push(o);
        });
      } else {
        options = config.options;
      }
      dashboard.emitState({
        nodeId: node.id,
        options: options,
      });
    });

    dashboard.addNode({
      node: node,
    });
  }
  RED.nodes.registerType("soop_list", SoopListNode);
};
