import React from 'react';
import ScreenTransition from './ScreenTransition';
import ScreenWrapper from './ScreenWrapper';
import Title from './Title';
import Prompt from './Prompt';

const TitleScreen = props => {
  return (
    <ScreenTransition show={props.show} timeout={200} type="fade">
      <ScreenWrapper>
        <Title />
        <Prompt>Press ENTER to start.</Prompt>
      </ScreenWrapper>
    </ScreenTransition>
  );
};

export default TitleScreen;
