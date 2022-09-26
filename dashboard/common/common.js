const FRONT_SOCKET_TYPE = {
  INIT_STATES: "initialize-state",
  UPDATE_STATE: "update-state",
  RECEIVE_MESSAGE: "receive-message",
};

const EDITOR_SOCKET_TYPE = {
  FLOW_DEPLOYED: "flow-deployed",
};

const DASHBOARD_PATH = "/dashboard";

const SOOP_NODE_TYPE = {
  CONFIG: "soopDashboardConfig",
  LOWER_CASE: "soopLowerCase",
  SWITCH: "soopSwitch",
};

exports.FRONT_SOCKET_TYPE = FRONT_SOCKET_TYPE;
exports.EDITOR_SOCKET_TYPE = EDITOR_SOCKET_TYPE;
exports.DASHBOARD_PATH = DASHBOARD_PATH;
exports.SOOP_NODE_TYPE = SOOP_NODE_TYPE;
