import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';
import store from '../store';

const initialState = {
  current: null,
  levels: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.LOAD_LEVEL:
      console.log('Loading level: ', action.payload.name);
      return updateObject(state, { current: action.payload });

    case actionTypes.STORE_LEVEL:
      const levels = [...store.levels];
      levels.push(action.payload);
      return updateObject(state, { levels: levels });

    default:
      return state;
  }
};

export default reducer;
