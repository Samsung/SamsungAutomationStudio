import { createStore, combineReducers } from "redux";

const SET_INIT_NODE = "node/SET_INIT_NODE";
const UPDATE_NODE = "node/UPDATE_NODE";

export const setInitNode = nodes => ({ type: SET_INIT_NODE, nodes });
export const updateNode = updateData => ({ type: UPDATE_NODE, updateData });

const initialState = {
  nodes: {},
};

function Node(state = initialState, action) {
  switch (action.type) {
    case SET_INIT_NODE:
      return {
        ...state,
        nodes: action.nodes,
      };
    case UPDATE_NODE:
      const newState = { ...state };
      pushNodeState(newState, action.updateData);
      return newState;
  }

  return state;
}

const rootReducer = combineReducers({ Node });
export const store = createStore(rootReducer);

/**
 * util functions
 */
function pushNodeState(newState, updateData) {
  const nodes = newState.nodes;

  for (let i = 0; i < nodes.tabs.length; ++i) {
    for (let j = 0; j < nodes.tabs[i].groups.length; ++j) {
      for (let k = 0; k < nodes.tabs[i].groups[j].nodes.length; ++k) {
        if (nodes.tabs[i].groups[j].nodes[k].id == updateData.nodeId) {
          if (updateData.isTimeSeries) nodes.tabs[i].groups[j].nodes[k].states.push(updateData.state);
          else nodes.tabs[i].groups[j].nodes[k].states = [updateData.state];
        }
      }
    }
  }
}
