module.exports = function (RED) {
  const dashboard = require("../dashboard")(RED);

  function LowerCaseNode(config) {
    const node = this;
    RED.nodes.createNode(node, config);

    dashboard.addNode({
      ...node,
      onMessage: message => {
        console.log(message);
        node.send("received message from a dashboard");
      },
    });

    node.on("input", function (msg, send, done) {
      send =
        send ||
        function () {
          node.send.apply(node, arguments);
        };

      msg.payload = msg.payload.toLowerCase();
      send(msg);
      if (done) done();
    });
  }

  RED.nodes.registerType("soopLowerCase", LowerCaseNode);
};
