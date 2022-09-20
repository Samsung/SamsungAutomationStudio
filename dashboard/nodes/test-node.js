module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);

  function TestNode(config) {
    const node = this;
    RED.nodes.createNode(node, config);
    console.log("Test Node created ");
  }

  RED.nodes.registerType("test-node", TestNode);
};
