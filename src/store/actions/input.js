import * as actionTypes from './actionTypes';

export const updateInput = (keyCode, value) => {
  return {
    type: actionTypes.UDPATE_INPUT,
    payload: {
      keyCode: keyCode,
      value: value
    }
  };
};

export const resetTaps = () => {
  return {
    type: actionTypes.RESET_TAPS
  };
};
