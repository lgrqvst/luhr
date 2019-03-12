import * as actionTypes from './actionTypes';

export const loadLevel = level => {
  return {
    type: actionTypes.LOAD_LEVEL,
    payload: level
  };
};

export const storeLevel = level => {
  return {
    type: actionTypes.STORE_LEVEL,
    payload: level
  };
};
