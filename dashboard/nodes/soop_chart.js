module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);

  function SoopChartNode(config) {
    const node = this;
    RED.nodes.createNode(node, config);

    const group = RED.nodes.getNode(config.group);
    if (!group) {
      return;
    }
    var tab = RED.nodes.getNode(group.config.tab);
    if (!tab) {
      return;
    }
    const chartType = config.chartType;
    let state = {
      // nodeId: node.id,
      node_id: node.id,
      nodeType: "chart",
      group: group,
      tab: tab,
      size: [
        parseInt(config.height || group.config.height / 2 + 1 || 4),
        parseInt(config.width || group.config.width || 6),
        parseInt(config.widgetX),
        parseInt(config.widgetY),
      ],
      // label: config.label,
      title: config.label,
      chartType: config.chartType,
      legend: config.legend === "true" ? true : false,
      blankLabel: config.blankLabel,
      isTimeSeries: config.isTimeSeries,
    };

    if (chartType === "line" || chartType === "bar") {
      state = Object.assign(state, {
        xAxisFormat: config.xAxisFormat,
        yMin: config.yMin ? parseInt(config.yMin) : "",
        yMax: config.yMax ? parseInt(config.yMax) : "",
        customValue: config.xAxisFormat === "custom" ? config.customValue : "",
      });
    }
    // send state to dashboard
    dashboard.emitState(state, config.isTimeSeries);
    node.on("input", function (msg, done) {
      if (isNaN(msg.payload)) {
        node.error("Payload is not a number.");
        return;
      }
      dashboard.emitState(
        {
          node_id: node.id,
          data: {
            [msg.label]: {
              value: parseInt(msg.payload),
            },
          },
        },
        config.isTimeSeries,
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
