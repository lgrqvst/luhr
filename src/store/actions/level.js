import * as actionTypes from './actionTypes';

export const loadLevel = level => {
  return {
    type: actionTypes.LOAD_LEVEL,
    payload: level
  };
};
