import * as actionTypes from '../actions/actionTypes';
import { updateObject, updateInput } from '../utility';

const initialState = {
  pressed: {
    thrust: false,
    boost: false,
    rotateCw: false,
    rotateCcw: false
  },
  tapped: {
    enter: false,
    esc: false
  }
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.UDPATE_INPUT:
      return updateInput(state, action.keyCode, action.value);
    case actionTypes.RESET_TAPS:
      return updateObject(state, {
        tapped: { enter: false, esc: false }
      });
    default:
      return state;
  }
};

export default reducer;
