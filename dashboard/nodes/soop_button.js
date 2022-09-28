module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);

  function SoopButtonNode(config) {
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

    let state = {
      nodeId: node.id,
      nodeType: "button",
      group: group,
      size: [
        parseInt(config.height || 1),
        parseInt(config.width || group.config.width || 6),
        parseInt(config.widgetX),
        parseInt(config.widgetY),
      ],
      background: config.background,
      shape: config.shape,
      tooltip: config.tooltip,
      icon: config.icon,
    };
    // send to dashboard
    dashboard.emitState(state);

    // when button clicked, the payload and topic would be...
    payload = config.payload;
    payloadType = config.payloadType;
    topic = config.topic;
    topicType = config.topicType;

    // dashboard.addNode({
    //   node: node,
    //   onMessage: msg => {
    //     RED.util.setMessageProperty(msg, 'payload', RED.util.evaluateNodeProperty(payload, payloadType, node, msg),true);
    //     msg.payload = payload;
    //     msg.topic = topic;
    //     node.send(msg);
    //   },
    // });

    node.on("input", function (msg, send, done) {
      if (topic) {
        RED.util.setMessageProperty(msg, "topic", RED.util.evaluateNodeProperty(topic, topicType, node, msg), true);
      } else {
        delete msg.topic;
      }
      if (payload) {
        RED.util.setMessageProperty(
          msg,
          "payload",
          RED.util.evaluateNodeProperty(payload, payloadType, node, msg),
          true,
        );
      } else {
        delete msg.payload;
      }

      send =
        send ||
        function () {
          node.send.apply(node, arguments);
        };
      if (config.getInput) {
        send(msg);
      }
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
  RED.nodes.registerType("soop_button", SoopButtonNode);
};
