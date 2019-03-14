import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  x: 0,
  y: 0,
  rotation: 270
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.INITIALIZE_SHIP:
      return updateObject(state, action.payload);

    case actionTypes.UPDATE_SHIP:
      // console.log('Updating ship');
      return updateObject(state, action.payload);

    case actionTypes.RESET_SHIP:
      return state;

    default:
      return state;
  }
};

export default reducer;
