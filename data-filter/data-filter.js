module.exports = function (RED) {
  function DataFilter(config) {
    RED.nodes.createNode(this, config);
  }
  RED.nodes.registerType("data-filter", DataFilter);
};
