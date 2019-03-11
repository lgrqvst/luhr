import React from 'react';
import ReactDOM from 'react-dom';
import Main from './Main';
import { Provider } from 'react-redux';
import store from './store/store';
import * as serviceWorker from './serviceWorker';

const game = (
  <Provider store={store}>
    <Main />
  </Provider>
);

ReactDOM.render(game, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
