module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);

  function SoopImageNode(config) {
    // Node Constructor
    RED.nodes.createNode(this, config);

    var node = this;

    // Add node information & event listener from dashboard
    dashboard.addNode({
      node: node,
    });
  }
  RED.nodes.registerType("soop_image", SoopImageNode);
};
