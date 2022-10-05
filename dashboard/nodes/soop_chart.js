module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);
  const { SOOP_NODE_TYPE } = require("../common/common");

  function SoopChartNode(config) {
    const node = this;
    RED.nodes.createNode(node, config);
    dashboard.addNode({
      node: node,
    });

    node.on("input", function (msg, done) {
      if (isNaN(msg.payload)) {
        node.error("Payload is not a number.");
        return;
      }
      dashboard.emitAndUpdateState(
        {
          nodeId: node.id,
          value: +msg.payload,
          label: msg.label,
        },
        config.isTimeSeries,
        true,
      );
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
  RED.nodes.registerType(SOOP_NODE_TYPE.CHART, SoopChartNode);
};
