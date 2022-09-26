module.exports = function(RED) {
  const dashboard = require("../dashboard")(RED);

  function SoopChartNode(config) {
    const node = this;
    RED.nodes.createNode(node, config);
    
    node.on("input", function (msg, send, done) {
      if (isNaN(msg.payload)) { return; }

      const group = RED.nodes.getNode(config.group);
      if(!group) { return; }
      var tab = RED.nodes.getNode(group.config.tab);
      if (!tab) { return; }
      const chartType = config.chartType;
      let extra = {};
      let state = {
        nodeId: node.id,
        nodeType: 'chart',
        group: group,
        size: [
          parseInt(config.height || group.config.width/2+1 || 4), 
          parseInt(config.width || group.config.width || 6)
        ],
        title: config.label,
        chartType: config.chartType,
        data: { label: msg.topic ? msg.topic:"dataset", value:msg.payload },
        legend: config.legend,
        blankLabel: config.blankLabel,
      };
      
      if (chartType === 'line') {
        extra = {
          RmMethod: config.removePastDataPoints ? 'point' : 'time',
          RmTime: config.removePastData * config.removePastDataUnit,
          RmPoint: config.removePastDataPoints,
          xAxisFormat: config.xAxisFormat,
          yMin: config.yMin,
          yMax: config.yMax,
          interpolate: config.interpolate,
          customValue: config.xAxisFormat === 'custom' ? config.customValue : ''
        } 
      } else if (chartType === 'bar'){
        extra = {
          yMin: config.yMin,
          yMax: config.yMax,
        }
      } else if (chartType === 'horizontalBar'){
        extra = {
          xMin: config.xMin,
          xMax: config.xMax,
        }
      } else {
        extra = {
          cutout: parseInt(config.cutout || 0),
        }
      }
      state = Object.assign(state, extra)
      
      // send state to dashboard
      dashboard.emitState(state)
      
      // send message
      send = send || function() { node.send.apply(node,arguments) }
      msg.payload = state
      send(msg);

      // done
      if (done) done();
    });

    node.on("close", function (removed, done) {
      if (removed) {
        node.log("This node has been disabled/deleted");
      } else {
        node.log("This node is being restarted");
      }
      done();
    });   
  }
  RED.nodes.registerType("soop_chart",SoopChartNode);
}