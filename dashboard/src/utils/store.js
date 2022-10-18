import { createStore, combineReducers } from "redux";

const INIT_DASHBOARD_STATE = "dashboard/INIT_DASHBOARD_STATE";
const UPDATE_NODE_STATE = "dashboard/UPDATE_NODE_STATE";

export const initDashboard = dashboard => ({ type: INIT_DASHBOARD_STATE, dashboard });
export const updateNode = updateData => ({ type: UPDATE_NODE_STATE, updateData });

const initialState = {};

function Dashboard(state = initialState, action) {
  switch (action.type) {
    case INIT_DASHBOARD_STATE:
      return {
        ...state,
        ...action.dashboard,
      };
    case UPDATE_NODE_STATE:
      const newState = JSON.parse(JSON.stringify(state));
      pushNodeState(newState, action.updateData);
      return newState;
  }

  return state;
}

export const updateGrid = (newGrid, tabId) => ({ type: "updateGrid", newGrid, tabId });

function tabsGrid(state = {}, action) {
  switch (action.type) {
    case "updateGrid":
      const newState = { ...state };
      const { newGrid, tabId } = action;
      newState[tabId] = newGrid;
      return newState;
    default:
      return state;
  }
}

const rootReducer = combineReducers({ dashboard: Dashboard, tabsGrid });
export const store = createStore(rootReducer);

/**
 * util functions
 */
function pushNodeState(newState, updateData) {
  const dashboard = newState;
  for (let i = 0; i < dashboard.tabs.length; ++i) {
    for (let j = 0; j < dashboard.tabs[i].groups.length; ++j) {
      for (let k = 0; k < dashboard.tabs[i].groups[j].nodes.length; ++k) {
        if (dashboard.tabs[i].groups[j].nodes[k].id == updateData.nodeId) {
          if (updateData.isLabeled) {
            const updateState = updateData.state;
            const label = "" + updateState.label;
            delete updateState.label;
            if (updateData.isTimeSeries) {
              if (Array.isArray(dashboard.tabs[i].groups[j].nodes[k].states))
                dashboard.tabs[i].groups[j].nodes[k].states = {};
              if (!dashboard.tabs[i].groups[j].nodes[k].states[label])
                dashboard.tabs[i].groups[j].nodes[k].states[label] = [];
              dashboard.tabs[i].groups[j].nodes[k].states[label].push(updateState);
            } else dashboard.tabs[i].groups[j].nodes[k].states[label] = [updateState];
          } else {
            if (updateData.isTimeSeries) {
              dashboard.tabs[i].groups[j].nodes[k].states.push(updateData.state);
            } else dashboard.tabs[i].groups[j].nodes[k].states = [updateData.state];
          }

          return;
        }
      }
    }
  }
}
