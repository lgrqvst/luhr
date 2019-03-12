import * as actionTypes from './actionTypes';

export const initializeShip = shipData => {
  return {
    type: actionTypes.INITIALIZE_SHIP,
    payload: shipData
  };
};

export const resetShip = () => {
  return {
    type: actionTypes.RESET_SHIP
  };
};

export const updateShip = shipData => {
  return {
    type: actionTypes.UPDATE_SHIP,
    payload: shipData
  };
};
