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
    socket.emit(FRONT_SOCKET_TYPE.INIT_NODE, getInitNodes());

    socket.on(FRONT_SOCKET_TYPE.RECEIVE_MESSAGE, message => {
      const node = globalNodes[message.nodeId].runtime;
      if (!node) return;
      if (typeof node.onMessage === "function") {
        node.onMessage(message);
      }
    });

    socket.on(EDITOR_SOCKET_TYPE.FLOW_DEPLOYED, nodes => {
      setInitNodes(nodes);
      io.emit(FRONT_SOCKET_TYPE.INIT_NODE, getInitNodes());
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
  if (Array.isArray(state)) io.emit(FRONT_SOCKET_TYPE.UPDATE_NODE, state);
  else io.emit(FRONT_SOCKET_TYPE.UPDATE_NODE, [state]);
}

function setInitNodes(nodes) {
  const exist = {};
  for (let i = 0; i < nodes.length; ++i) {
    if (!globalNodes[nodes[i].id]) globalNodes[nodes[i].id] = {};

    globalNodes[nodes[i].id].editor = nodes[i];
    globalNodes[nodes[i].id].states = [];

    exist[nodes[i].id] = true;
  }

  Object.keys(globalNodes).map(key => {
    if (!exist[key]) {
      delete globalNodes[key];
    }
  });
}

function addNode(nodeObject) {
  if (typeof nodeObject != "object") return;
  const node = nodeObject.node;
  if (!node) return;

  if (globalNodes && globalNodes.hasOwnProperty(node.id)) {
    globalNodes[node.id].runtime = nodeObject;
  } else {
    globalNodes[node.id] = {
      runtime: nodeObject,
      states: [],
    };
  }
}

function getInitNodes() {
  const initNodes = {};
  Object.keys(globalNodes).map(key => {
    initNodes[key] = {
      editor: globalNodes[key].editor,
      states: globalNodes[key].states,
    };
  });

  return initNodes;
}
