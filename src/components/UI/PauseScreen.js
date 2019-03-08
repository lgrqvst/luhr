import React from 'react';
import ScreenTransition from './ScreenTransition';
import ScreenWrapper from './ScreenWrapper';
import Title from './Title';

const PauseScreen = props => {
  return (
    <ScreenTransition show={props.show} timeout={200} type="fade">
      <ScreenWrapper>
        <Title />
        <p>All right, friendo, easy there. You managed to pause the game. Now what?</p>
        <p>Hit ENTER or ESC to resume, yeah?</p>
      </ScreenWrapper>
    </ScreenTransition>
  );
};

export default PauseScreen;
