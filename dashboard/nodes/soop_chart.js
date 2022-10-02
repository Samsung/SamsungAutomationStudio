module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);

  function SoopChartNode(config) {
    const node = this;
    RED.nodes.createNode(node, config);

    node.on("input", function (msg, done) {
      if (isNaN(msg.payload)) {
        node.error("Payload is not a number.");
        return;
      }
      dashboard.emitState(
        {
          nodeId: node.id,
          data: {
            [msg.label]: {
              value: +msg.payload,
            },
          },
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
  RED.nodes.registerType("soop_chart", SoopChartNode);
};
