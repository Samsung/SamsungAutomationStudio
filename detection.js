module.exports = function(RED) {
  function DetectionPose(config) {
    RED.nodes.createNode(this, config);

    let node = this;
    this.on('input', function(msg, send, done) {
        send = send || function() { node.send.apply(node,arguments) }

        send(msg);

        if (done) {
            this.log("This node has been done");
            done();
        }
    });

    this.on('close', function(removed, done) {
      if (removed) {
          // This node has been disabled/deleted
        this.log("This node has been disabled/deleted");
      } else {
          // This node is being restarted
        this.log("This node is being restarted");
      }
      done();
  });
  }
  RED.nodes.registerType("detection-ijin", DetectionPose, {
    settings: {
      detectionIjin: {
          value: "red",
          exportable: true
      }
    }
  });
}