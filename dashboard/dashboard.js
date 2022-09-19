let initialized = false;

module.exports = function (RED) {
  if (!initialized) {
    initialized = true;
    init(RED.httpNode || RED.httpAdmin, RED.settings);
  }

  return {
    testFunc,
  };
};

const path = require("path");
const serveStatic = require("serve-static");

function init(app, settings) {
  // const path = `${settings.httpNodeRoot}${settings.path}`;
  // app.use(path, serveStatic(path.join(__dirname, "/dist")));

  app.use("/dashboard", serveStatic(path.join(__dirname, "/dist")));
  console.log("react dashboard started at /dashboard");
}

function testFunc() {
  return "test message";
}
