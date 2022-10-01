import { createStore, combineReducers } from "redux";

const SET_INIT_NODE = "node/SET_INIT_NODE";
const UPDATE_NODE = "node/UPDATE_NODE";

export const setInitNode = nodes => ({ type: SET_INIT_NODE, nodes });
export const updateNode = updateData => ({ type: UPDATE_NODE, updateData });

const initialState = {
  nodes: {},
};

function node(state = initialState, action) {
  switch (action.type) {
    case SET_INIT_NODE:
      return {
        ...state,
        nodes: action.nodes,
      };
    case UPDATE_NODE:
      const newState = { ...state };
      const updateData = action.updateData;

      if (updateData && updateData.state) {
        if (updateData.isTimeSeries) newState.nodes[updateData.nodeId].states.push(updateData.state);
        else newState.nodes[updateData.nodeId].states = [updateData.state];
      }

      return {
        ...newState,
      };
  }

  return state;
}

export const updateGrid = (newGrid, tabId) => ({ type: "updateGrid", newGrid, tabId });

// const initialGrid = { id: [{ i: 0, w: 1, h: 1, x: 1, y: 1, static: true }] };

function tabsGrid(state = {}, action) {
  switch (action.type) {
    case "updateGrid":
      const newState = { ...state };
      const { newGrid, tabId } = action;
      newState[tabId] = newGrid;
      console.log("리듀서:", newState);
      return newState;
    default:
      return state;
  }
}

const rootReducer = combineReducers({ node, tabsGrid });
export const store = createStore(rootReducer);
