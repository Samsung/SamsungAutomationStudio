let initialized = false;

module.exports = function (RED) {
  if (!initialized) {
    initialized = true;
    init(RED);
  }

};

const path = require("path");
const serveStatic = require("serve-static");

function init(RED) {
  const app = RED.httpNode || RED.httpAdmin;

  app.use('/model', serveStatic(path.join(__dirname, './nodes/object-detection-node/model')));
  
}
