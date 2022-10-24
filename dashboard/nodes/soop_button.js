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

    function setMessage(msg, type, value, valueType) {
      if (value) {
        RED.util.setMessageProperty(msg, type, RED.util.evaluateNodeProperty(value, valueType, node, msg), true);
      } else {
        type === "topic" ? delete msg.topic : delete msg.payload;
      }
      return msg;
    }

    function sendMessage(msg) {
      msg = setMessage(msg, "topic", topic, topicType);
      msg = setMessage(msg, "payload", payload, payloadType);
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
