import { createStore, combineReducers } from "redux";

const SET_INIT_STATE = "node/SET_INIT_STATE";

export const setInitState = (states) => ({
  type: SET_INIT_STATE,
  states,
});

function node(state = {}, action) {
  switch (action.type) {
    case SET_INIT_STATE:
      return {
        ...state,
        states: action.states,
      };
  }

  return state;
}

const rootReducer = combineReducers({ node });
export const store = createStore(rootReducer);
