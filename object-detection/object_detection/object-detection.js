module.exports = function (RED) {
  function ObjectDetectionNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    function HTML() {
      return require("./object-detection-html.js").code(config);
    }

    node.on("input", function (msg, send) {
      let savedObjName = config.objField;
      let savedPoseName = config.poseField;

      if (config.objFieldType === "flow") {
        config.registered = this.context().flow.get(String(savedObjName));
      } else if (config.objFieldType === "global") {
        config.registered = this.context().global.get(String(savedObjName));
      } else {
        config.registered = this.context().node.get(String(savedObjName));
      }

      if (config.poseFieldType === "flow") {
        config.registeredPose = this.context().flow.get(String(savedPoseName));
      } else if (config.poseFieldType === "global") {
        config.registeredPose = this.context().global.get(String(savedPoseName));
      } else {
        config.registeredPose = this.context().node.get(String(savedPoseName));
      }

      msg.payload = HTML();
      send =
        send ||
        function () {
          this.send.apply(this, arguments);
        };
      send(msg);
    });
  }

  RED.nodes.registerType("object-detection", ObjectDetectionNode);
};
