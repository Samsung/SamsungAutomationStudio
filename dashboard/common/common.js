const FRONT_SOCKET_TYPE = {
  INIT_DASHBOARD_STATE: "init-dashboard-state",
  UPDATE_NODE_STATE: "update-node-state",
  RECEIVE_MESSAGE: "receive-message",
};

const EDITOR_SOCKET_TYPE = {
  FLOW_DEPLOYED: "flow-deployed",
};

const DASHBOARD_PATH = "/dashboard";

const SOOP_NODE_TYPE = {
  BUTTON: "soop_button",
  CHART: "soop_chart",
  CONFIG: "soop_dashboard_config",
  FORMAT: "soop_data_format",
  DROPDOWN: "soop_dropdown",
  GAUGE: "soop_gauge",
  GROUP: "soop_group",
  IMAGE: "soop_image",
  LIST: "soop_list",
  SLIDER: "soop_slider",
  SWITCH: "soop_switch",
  TAB: "soop_tab",
  TEXT: "soop_text",
};

exports.FRONT_SOCKET_TYPE = FRONT_SOCKET_TYPE;
exports.EDITOR_SOCKET_TYPE = EDITOR_SOCKET_TYPE;
exports.DASHBOARD_PATH = DASHBOARD_PATH;
exports.SOOP_NODE_TYPE = SOOP_NODE_TYPE;
