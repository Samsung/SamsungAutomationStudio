import { createStore, combineReducers } from "redux";

const SET_INIT_NODE = "node/SET_INIT_NODE";
const UPDATE_NODE = "node/UPDATE_NODE";

export const setInitNode = nodes => ({ type: SET_INIT_NODE, nodes });
export const updateNode = states => ({ type: UPDATE_NODE, states });

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
      const newState = {
        ...state,
      };

      return newState;
  }

  return state;
}

const rootReducer = combineReducers({ node });
export const store = createStore(rootReducer);
