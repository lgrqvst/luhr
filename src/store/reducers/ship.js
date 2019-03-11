import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  x: 0,
  y: 0
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INITIALIZE_SHIP:
      return updateObject(state, action.payload);

    case actionTypes.RESET_SHIP:
      return state;

    default:
      return state;
  }
};

export default reducer;
