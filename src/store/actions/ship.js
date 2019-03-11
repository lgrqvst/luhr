import * as actionTypes from './actionTypes';

export const initializeShip = ship => {
  return {
    type: actionTypes.INITIALIZE_SHIP,
    payload: ship
  };
};

export const resetShip = () => {
  return {
    type: actionTypes.RESET_SHIP
  };
};
