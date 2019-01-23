import React from 'react';
import ReactDOM from 'react-dom';
import Game from './Game';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import reducer from './store/reducer';
import * as serviceWorker from './serviceWorker';

const store = createStore(reducer);

const game = (
  <Provider store={store}>
    <Game />
  </Provider>
);

ReactDOM.render(game, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
