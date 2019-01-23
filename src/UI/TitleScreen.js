import React from 'react';
import ScreenTransition from './ScreenTransition';

const TitleScreen = props => {
  return (
    <ScreenTransition show={props.show} timeout={1000}>
      <h1>RAVr</h1>
      <p>Press ENTER to start.</p>
      {/* <h1>TEST</h1> */}
    </ScreenTransition>
  );
};

export default TitleScreen;
