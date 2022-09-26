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
let globalNodes = {};

function init(RED) {
  const app = RED.httpNode || RED.httpAdmin;
  const server = RED.server;

  io = socketio(server);
  initSocket(io);

  app.use(DASHBOARD_PATH, serveStatic(path.join(__dirname, "/dist")));
}

function initSocket(io) {
  io.on("connection", socket => {
    socket.emit(FRONT_SOCKET_TYPE.INIT_STATES, getInitNodeStates);

    socket.on(FRONT_SOCKET_TYPE.RECEIVE_MESSAGE, message => {
      const node = globalNodes[message.nodeId].runtime;
      if (!node) return;
      if (typeof node.onMessage === "function") {
        node.onMessage(message);
      }
    });

    socket.on(EDITOR_SOCKET_TYPE.FLOW_DEPLOYED, nodes => {
      setInitNodes(nodes);
      io.emit(FRONT_SOCKET_TYPE.INIT_STATES, globalNodes);
    });
  });
}

function emitState(state) {
  const nodeId = state.node_id;
  state.time = Date.now();

  if (globalNodes && globalNodes.hasOwnProperty(nodeId)) {
    if (Array.isArray(globalNodes[nodeId].states)) {
      globalNodes[nodeId].states.push(state);
    } else {
      globalNodes[nodeId].states = [state];
    }
  } else {
    globalNodes[nodeId] = {
      states: [state],
    };
  }

  emit(state);
}

function emit(state) {
  if (Array.isArray(state)) io.emit(FRONT_SOCKET_TYPE.UPDATE_STATE, state);
  else io.emit(FRONT_SOCKET_TYPE.UPDATE_STATE, [state]);
}

function setInitNodes(nodes) {
  for (let i = 0; i < nodes.length; ++i) {
    globalNodes[nodes[i].id] = {
      editor: nodes[i],
      states: [],
    };
  }
}

function addNode(node) {
  if (globalNodes && globalNodes.hasOwnProperty(node.id)) {
    globalNodes[node.id].runtime = node;
  } else {
    globalNodes[node.id] = {
      runtime: node,
      data: [],
    };
  }
}

function getInitNodeStates() {
  return globalNodes.map(node => {
    return {
      editor: node.editor,
      states: node.states,
    };
  });
}
