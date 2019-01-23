import layers from '../data/layers';
import * as gameStates from '../data/gameStates';
import * as actionTypes from './actionTypes';

const initialState = {
  layers: layers,
  gameState: gameStates.TITLE,
  previousGameState: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_GAME_STATE:
      const updatedState = {
        ...state,
        gameState: action.gameState,
        previousGameState: state.gameState
      };
      return updatedState;

    default:
      return state;
  }
};

export default reducer;
