module.exports = function (RED) {
  function DashboardNode(config) {
    const node = this;
    RED.nodes.createNode(node, config);
  }

  RED.nodes.registerType("soop_dashboard_config", DashboardNode);
};
