import layers from '../data/layers';
import * as gameStates from '../data/gameStates';
import * as actionTypes from './actionTypes';

const initialState = {
  layers: layers,
  gameState: gameStates.TITLE,
  previousGameState: null,
  stage: []
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

    case actionTypes.ADD_TO_STAGE:
      console.log('Add', action.element);
      return state;

    case actionTypes.REMOVE_FROM_STAGE:
      console.log('Remove', action.id);
      return state;

    case actionTypes.CLEAR_STAGE:
      console.log('Clear');
      return state;

    default:
      return state;
  }
};

export default reducer;
