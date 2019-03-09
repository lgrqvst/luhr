import * as actionTypes from '../actions/actionTypes';

const initialState = {};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_CHUNK:
      console.log('Adding chunk: ', action.payload.id);
      return state;
    case actionTypes.DISCARD_CHUNK:
      console.log('Discarding chunk: ', action.payload.id);
      return state;
    default:
      return state;
  }
};

export default reducer;
