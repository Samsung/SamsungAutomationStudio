module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);

  function LowerCaseNode(config) {
    const node = this;
    RED.nodes.createNode(node, config);
    node.on("input", function (msg, send, done) {
      send =
        send ||
        function () {
          node.send.apply(node, arguments);
        };

      // node.status({ fill: "red", shape: "ring", text: "disconnected" });
      msg.payload = msg.payload.toLowerCase();
      send(msg);
      if (done) done();
    });
  }

  RED.nodes.registerType("lower-case", LowerCaseNode);
};
