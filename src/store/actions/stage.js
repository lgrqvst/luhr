import * as actionTypes from './actionTypes';

export const addChunk = chunk => {
  return {
    type: actionTypes.ADD_CHUNK,
    payload: chunk
  };
};

export const discardChunk = id => {
  return {
    type: actionTypes.DISCARD_CHUNK,
    payload: {
      id: id
    }
  };
};

export const updateStageScrollPosition = position => {
  return {
    type: actionTypes.UPDATE_STAGE_POS,
    payload: position
  };
};
