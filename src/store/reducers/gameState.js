import * as actionTypes from '../actions/actionTypes';
import * as gameStates from '../../data/gameStates';
import { updateObject } from '../utility';

const initialState = {
  current: gameStates.TITLE,
  previous: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_GAME_STATE:
      return updateObject(state, {
        current: action.payload.gameState,
        previous: state.current
      });
    default:
      return state;
  }
};

export default reducer;
