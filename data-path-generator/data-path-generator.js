module.exports = function (RED) {
  function DataPathGenerator(config) {
    RED.nodes.createNode(this, config);
  }
  RED.nodes.registerType("data-path-generator", DataPathGenerator);
};
