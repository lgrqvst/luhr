import * as actionTypes from '../actions/actionTypes';

const initialState = {
  chunks: [],
  stageScrollPosX: 0,
  stageScrollPosY: 0
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_CHUNK:
      console.log('Adding chunk: ', action.payload.id);
      return state;
    case actionTypes.DISCARD_CHUNK:
      console.log('Discarding chunk: ', action.payload.id);
      return state;
    case actionTypes.UPDATE_STAGE_POS:
      console.log('Updating stage position: X: ' + action.payload.x + ', Y: ' + action.payload.y);
    default:
      return state;
  }
};

export default reducer;
