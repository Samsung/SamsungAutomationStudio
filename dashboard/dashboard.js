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
let globalState = {};

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
    // socket.emit(FRONT_SOCKET_TYPE.INIT_NODE, getInitState());

    socket.on(EDITOR_SOCKET_TYPE.FLOW_DEPLOYED, nodes => {
      setInitNodes(nodes);
      io.emit(FRONT_SOCKET_TYPE.INIT_NODE, getInitNodes());
    });
    // socket.on(EDITOR_SOCKET_TYPE.FLOW_DEPLOYED, state => {
    //   setInitState(state);
    //   io.emit(FRONT_SOCKET_TYPE.INIT_NODE, getInitState());
    // });

    socket.on(FRONT_SOCKET_TYPE.RECEIVE_MESSAGE, message => {
      const node = globalNodes[message.nodeId].runtime;
      if (!node) return;
      if (typeof node.onMessage === "function") {
        node.onMessage(message);
      }
    });
  });
}

function emitState(state, isTimeSeries = false) {
  const nodeId = state.node_id;

  if (globalNodes && !globalNodes.hasOwnProperty(nodeId)) return;

  if (isTimeSeries) {
    state.time = Date.now();
  } else {
    globalNodes[nodeId].states = [];
  }

  const sendState = { ...state };
  delete sendState.node_id;

  globalNodes[nodeId].states.push(sendState);

  emit(nodeId, sendState, isTimeSeries);
}

function emit(nodeId, state, isTimeSeries) {
  io.emit(FRONT_SOCKET_TYPE.UPDATE_NODE, { nodeId, isTimeSeries, state: state });
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

function addNode(nodeObject) {
  if (typeof nodeObject != "object") return;
  const node = nodeObject.node;
  if (!node) return;

  globalNodes[node.id] = {
    ...nodeObject,
    states: [],
  };
}

// function setInitState(state) {
//   globalState = { ...state };
//   syncGlobalNode();
// }

// function getInitState() {
//   const initState = {};

//   const tabs = [];
//   for (const tab of globalState.tabs) {
//     const initTab = { ...tab };

//     const groups = [];
//     for (const group of globalState.groups) {
//       const initGroup = { ...group };

//       const nodes = [];
//       for (const node of group.nodes) {
//         nodes.push({
//           editor: node,
//           states: globalNodes[node.id].states,
//         });
//       }

//       initGroup.nodes = nodes;
//       groups.push(initGroup);
//     }

//     initTab.groups = groups;
//     tabs.push(initTab);
//   }

//   return initState;
// }

// function syncGlobalNode() {
//   const exists = {};

//   for (const tab of globalState.tabs) {
//     for (const group of tab.groups) {
//       for (const node of group.nodes) {
//         exists[node.id] = true;
//       }
//     }
//   }

//   for (const id in globalNodes) {
//     if (!exists[id]) delete globalNodes[id];
//   }
// }
