module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);

  function SoopSliderNode(config) {
    // Node-specific code
    RED.nodes.createNode(this, config);

    var node = this;

    // var group = RED.nodes.getNode(config.group);
    // if (!group) {
    //   return;
    // }
    // var tab = RED.nodes.getNode(group.config.tab);
    // if (!tab) {
    //   return;
    // }

    // Add node information & event listener from dashboard
    dashboard.addNode({
      node: node,
      onMessage: message => {
        node.send({
          payload: message.value,
        });
      },
    });
    
    // Send runtime information to dashboard
    var step = config.step > Math.abs(config.min - config.max) ? 1 : config.step;
    var state = {
      nodeId: node.id,
      nodeType: config.type,
      group: config.group, // need to revise
      size: [], // need to revise
      name: config.name,
      color: config.colorPicking,
      label: config.label,
      tooltip: config.tooltip,
      range: [config.min, config.max, step],
      when: config.send,
      invert: parseFloat(config.min) > parseFloat(config.max) ? true : false,
      payload: Math.min(config.min, config.max),
    }

    dashboard.emitState(state);

    // Receive msg from upstream node in a flow
    node.on("input", function (msg) {
      if(config.pass){
        state.payload = Math.max(config.min, Math.min(config.max, parseInt(msg.payload)));
        dashboard.emitState(state);
      }
    });
  }
  RED.nodes.registerType("soop_slider", SoopSliderNode);
};
