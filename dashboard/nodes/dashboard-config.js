module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);

  function TestNode(config) {
    const node = this;
    RED.nodes.createNode(node, config);
    node.log("Dashboard config created");
  }

  RED.nodes.registerType("soop-dashboard-config", TestNode);
};
