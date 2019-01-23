import React from 'react';

import transition from 'styled-transition-group';

const ScreenTransition = props => {
  return (
    <ScreenTransitionElement
      in={props.show}
      timeout={props.timeout}
      unmountOnExit
    >
      {props.children}
    </ScreenTransitionElement>
  );
};

const ScreenTransitionElement = transition.div`
  &:enter { opacity: 0.01; }
  &:enter-active {
    opacity: 1;
    transition: opacity ${props => props.timeout}ms ease-in;
  }
  &:exit { opacity: 1; }
  &:exit-active {
    opacity: 0.01;
    transition: opacity ${props => props.timeout}ms ease-in;
  }
`;

export default ScreenTransition;
