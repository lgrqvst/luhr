import keyCodes from '../data/keyCodes';

export const updateObject = (oldObject, updatedValues) => {
  return {
    ...oldObject,
    ...updatedValues
  };
};

export const updateInput = (state, keyCode, value) => {
  switch (keyCode) {
    case keyCodes.W:
      return updatePressed(state, 'thrust', value);
    case keyCodes.S:
      return updatePressed(state, 'boost', value);
    case keyCodes.A:
      return updatePressed(state, 'rotateCcw', value);
    case keyCodes.D:
      return updatePressed(state, 'rotateCw', value);
    case keyCodes.ENTER:
      return updateTapped(state, 'enter', value);
    case keyCodes.ESC:
      return updateTapped(state, 'esc', value);
    default:
      return {
        ...state
      };
  }
};

const updatePressed = (state, field, value) => {
  return {
    ...state,
    pressed: {
      ...state.pressed,
      [field]: value
    }
  };
};

const updateTapped = (state, field, value) => {
  return {
    ...state,
    tapped: {
      ...state.tapped,
      [field]: value ? false : true
    }
  };
};
