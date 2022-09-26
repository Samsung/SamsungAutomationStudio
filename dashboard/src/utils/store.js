import { createStore, combineReducers } from "redux";

const SET_INIT_NODE = "node/SET_INIT_NODE";

export const setInitNode = nodes => ({
  type: SET_INIT_NODE,
  nodes,
});

function node(state = {}, action) {
  switch (action.type) {
    case SET_INIT_NODE:
      return {
        ...state,
        nodes: action.nodes,
      };
  }

  return state;
}

const rootReducer = combineReducers({ node });
export const store = createStore(rootReducer);
