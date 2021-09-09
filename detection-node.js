module.exports = function(RED) {
  function DetectionNode(config) {
      RED.nodes.createNode(this,config);
      var node = this;
      node.on('input', function(msg) {
          msg.payload = node.namenode;
          node.send(msg);
      });
  }
  RED.nodes.registerType("detection", DetectionNode);
}