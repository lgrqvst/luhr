import React from 'react';
import ScreenTransition from './ScreenTransition';

const GameOverScreen = props => {
  return (
    <ScreenTransition show={props.show} timeout={1000}>
      <h1>RAVr</h1>
      <p>Ya did ya best kiddo, but now it's over.</p>
      <p>Guess you could always try again?</p>
    </ScreenTransition>
  );
};

export default GameOverScreen;
