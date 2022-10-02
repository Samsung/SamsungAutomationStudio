module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);

  function SoopSliderNode(config) {
    // Node-specific code
    RED.nodes.createNode(this, config);

    var node = this;

    // Add node information & event listener from dashboard
    dashboard.addNode({
      node: node,
      onMessage: message => {
        node.send({
          payload: message.value,
        });
      },
    });

    // Receive msg from upstream node in a flow
    node.on("input", function (msg) {
      if(config.pass && parseInt(msg.payload) != NaN){
        dashboard.emitState({
          nodeId: node.id,
          value: Math.max(config.min, Math.min(config.max, parseInt(msg.payload)))
        })
      }
    });
  }
  RED.nodes.registerType("soop_slider", SoopSliderNode);
};
