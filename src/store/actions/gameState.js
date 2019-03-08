import * as actionTypes from './actionTypes';

export const setGameState = gameState => {
  return {
    type: actionTypes.SET_GAME_STATE,
    payload: {
      gameState: gameState
    }
  };
};
