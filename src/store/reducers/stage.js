import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../utility';

const initialState = {
  chunks: [],
  objects: [],
  width: 0,
  height: 0,
  scrollX: 0,
  scrollY: 0,
  scrollXMin: 0,
  scrollXMax: 0,
  scrollYMin: 0,
  scrollYMax: 0
};

const reducer = (state = initialState, action) => {
  let chunks;
  switch (action.type) {
    case actionTypes.ADD_CHUNK:
      console.log('Adding chunk: ', action.payload.id);
      chunks = [...state.chunks];
      chunks.push(action.payload);
      return updateObject(state, { chunks: chunks });

    case actionTypes.DISCARD_CHUNK:
      console.log('Discarding chunk: ', action.payload.id);
      chunks = [...state.chunks].filter(el => {
        return el.id !== action.payload.id;
      });
      return updateObject(state, { chunks: chunks });

    case actionTypes.ADD_OBJECT_TO_STAGE:
      console.log('Adding object to stage');
      const objects = [...state.objects];
      objects.push(action.payload);
      return updateObject(state, { objects: objects });

    case actionTypes.REMOVE_OBJECT_FROM_STAGE:
      console.log('Removing object from stage: ', action.payload.id);
      return state;

    case actionTypes.UPDATE_STAGE_SIZE:
      console.log('Updating stage size');
      return updateObject(state, { width: action.payload.width, height: action.payload.height });

    case actionTypes.INITIALIZE_STAGE_POS:
      console.log('Updating stage scroll: x: ' + action.payload.x + ', y: ' + action.payload.y);
      return updateObject(state, {
        scrollX: action.payload.x,
        scrollY: action.payload.y,
        scrollXMax: action.payload.xMax,
        scrollYMax: action.payload.yMax,
        scrollXMin: action.payload.xMin,
        scrollYMin: action.payload.yMin
      });

    case actionTypes.UPDATE_STAGE_POS:
      return updateObject(state, action.payload);

    case actionTypes.UPDATE_STAGE_CONSTRAINTS:
      return state;

    default:
      return state;
  }
};

export default reducer;
