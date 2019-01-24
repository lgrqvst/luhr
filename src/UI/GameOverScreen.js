import React from 'react';
import ScreenTransition from './ScreenTransition';
import ScreenWrapper from './ScreenWrapper';
import Title from './Title';

const GameOverScreen = props => {
  return (
    <ScreenTransition show={props.show} timeout={2000} type="fade">
      <ScreenWrapper>
        <Title />
        <p>Ya did ya best kiddo, but now it's over.</p>
        <p>Guess you could always try again?</p>
      </ScreenWrapper>
    </ScreenTransition>
  );
};

export default GameOverScreen;
