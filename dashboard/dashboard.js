let initialized = false;

module.exports = function (RED) {
  if (!initialized) {
    initialized = true;
    init(RED);
  }

  return {
    emit,
  };
};

const path = require("path");
const socketio = require("socket.io");
const serveStatic = require("serve-static");

let io = null;

function init(RED) {
  const app = RED.httpNode || RED.httpAdmin;
  const server = RED.server;

  io = socketio(server);
  initSocket(io);

  RED.nodes.eachNode(function callback(node) {
    console.log(node);
  });

  // const settings = RED.settings;
  // const path = `${settings.httpNodeRoot}${settings.path}`;
  // app.use(path, serveStatic(path.join(__dirname, "/dist")));

  app.use("/dashboard", serveStatic(path.join(__dirname, "/dist")));
  console.log("react dashboard started at /dashboard");
}

function initSocket(io) {
  io.on("connection", (socket) => {
    socket.emit("hello", "world");
  });
}

function emit(data) {
  console.log(data);
  io.emit("update-value", data);
}
