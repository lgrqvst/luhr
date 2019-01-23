import React from 'react';
import ScreenTransition from './ScreenTransition';

const PauseScreen = props => {
  return (
    <ScreenTransition show={props.show} timeout={250}>
      <h1>RAVr</h1>
      <p>
        All right, friendo, easy there. You managed to pause the game. Now what?
      </p>
      <p>Hit ENTER or ESC to resume, yeah?</p>
    </ScreenTransition>
  );
};

export default PauseScreen;
