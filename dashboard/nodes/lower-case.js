module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);

  function LowerCaseNode(config) {
    const node = this;
    RED.nodes.createNode(node, config);

    node.on("input", function (msg, send, done) {
      node.log("input has arrived " + dashboard.testFunc());
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

    node.on("close", function (removed, done) {
      if (removed) {
        node.log("This node has been disabled/deleted");
      } else {
        node.log("This node is being restarted");
      }
      done();
    });
  }

  RED.nodes.registerType("lower-case", LowerCaseNode);
};
