module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);
  const { SOOP_NODE_TYPE } = require("../common/common");

  function SoopButtonNode(config) {
    const node = this;
    RED.nodes.createNode(node, config);

    // when button clicked, the payload and topic would be...
    payload = config.payload;
    payloadType = config.payloadType;
    topic = config.topic;
    topicType = config.topicType;

    if (payloadType === "date") {
      payload = Date.now();
    }

    function sendMessage(msg) {
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
      node.send(msg);
    }

    dashboard.addNode({
      node: node,
      onMessage: () => {
        sendMessage({ payload: "", topic: "" });
      },
    });

    node.on("input", function (msg, done) {
      if (config.getInput) {
        sendMessage(msg);
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
  RED.nodes.registerType(SOOP_NODE_TYPE.BUTTON, SoopButtonNode);
};
