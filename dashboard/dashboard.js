let initialized = false;

module.exports = function (RED) {
  if (!initialized) {
    initialized = true;
    init(RED);
  }

  return {
    emitState,
    addNode,
  };
};

const path = require("path");
const socketio = require("socket.io");
const serveStatic = require("serve-static");
const { FRONT_SOCKET_TYPE, EDITOR_SOCKET_TYPE, DASHBOARD_PATH } = require("./common/common");

let io = null;
let dashboardState = {};
let dashboardNodes = {};

function init(RED) {
  const app = RED.httpNode || RED.httpAdmin;
  const server = RED.server;

  io = socketio(server);
  initSocket(io);

  app.use(DASHBOARD_PATH, serveStatic(path.join(__dirname, "/dist")));
}

function initSocket(io) {
  io.on("connection", socket => {
    socket.emit(FRONT_SOCKET_TYPE.INIT_STATES, dashboardState);

    socket.on(FRONT_SOCKET_TYPE.RECEIVE_MESSAGE, (message) => {
      const node = dashboardNodes[message.nodeId];
      if (!node) return;
      if (typeof node.onMessage === "function") {
        node.onMessage(message);
      }
    });

    socket.on(EDITOR_SOCKET_TYPE.FLOW_DEPLOYED, (nodes) => {
      initializeDashboardState(nodes);
      io.emit(FRONT_SOCKET_TYPE.INIT_STATES, dashboardState);
    });
  });
}

function initializeDashboardState(nodes) {
  dashboardState = {};
  for (let i = 0; i < nodes.length; ++i) {
    dashboardState[nodes[i].id] = {
      attr: nodes[i],
      data: [],
    };
  }
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
  if (Array.isArray(state)) io.emit(FRONT_SOCKET_TYPE.UPDATE_STATE, state);
  else io.emit(FRONT_SOCKET_TYPE.UPDATE_STATE, [state]);
}

function addNode(node) {
  dashboardNodes[node.id] = node;
}
