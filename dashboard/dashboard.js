let initialized = false;

module.exports = function (RED) {
  if (!initialized) {
    initialized = true;
    init(RED);
  }

  return {
    emitState,
  };
};

const path = require("path");
const socketio = require("socket.io");
const serveStatic = require("serve-static");

let io = null;
const dashboardState = {};

function init(RED) {
  const app = RED.httpNode || RED.httpAdmin;
  const server = RED.server;

  io = socketio(server);
  initSocket(io);

  // const settings = RED.settings;
  // const path = `${settings.httpNodeRoot}${settings.path}`;
  // app.use(path, serveStatic(path.join(__dirname, "/dist")));

  app.use("/dashboard", serveStatic(path.join(__dirname, "/dist")));
  console.log("react dashboard started at /dashboard");
}

function initSocket(io) {
  io.on("connection", (socket) => {
    socket.emit("initial-value", dashboardState);

    socket.on("flow-deployed", (nodes) => {
      console.log("new flow", nodes);
    });
  });
}

function emitState(state) {
  const node_id = state.node_id;
  state.time = Date.now();

  if (dashboardState.hasOwnProperty(node_id)) {
    dashboardState[node_id].push(state);
  } else {
    dashboardState[node_id] = [state];
  }

  emit(state);
}

function emit(state) {
  if (Array.isArray(state)) io.emit("update-value", state);
  else io.emit("update-value", [state]);
}
