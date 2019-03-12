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

export const addObjectToStage = object => {
  return {
    type: actionTypes.ADD_OBJECT_TO_STAGE,
    payload: object
  };
};

export const removeObjectFromStage = id => {
  return {
    type: actionTypes.REMOVE_OBJECT_FROM_STAGE,
    payload: {
      id: id
    }
  };
};

export const updateStageSize = size => {
  return {
    type: actionTypes.UPDATE_STAGE_SIZE,
    payload: size
  };
};

export const initializeStagePosition = position => {
  return {
    type: actionTypes.INITIALIZE_STAGE_POS,
    payload: position
  };
};

export const updateStagePosition = position => {
  return {
    type: actionTypes.UPDATE_STAGE_POS,
    payload: position
  };
};

export const updateStageConstraints = constraints => {
  return {
    type: actionTypes.UPDATE_STAGE_CONSTRAINTS,
    payload: constraints
  };
};
