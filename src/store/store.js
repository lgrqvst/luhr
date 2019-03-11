import { createStore, combineReducers } from 'redux';
import gameStateReducer from './reducers/gameState';
import inputReducer from './reducers/input';
import levelReducer from './reducers/level';
import stageReducer from './reducers/stage';
import shipReducer from './reducers/ship';

const rootReducer = combineReducers({
  gameState: gameStateReducer,
  input: inputReducer,
  level: levelReducer,
  stage: stageReducer,
  ship: shipReducer
});

const store = createStore(rootReducer);

export default store;
