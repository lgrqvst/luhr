import React from 'react';

import { css } from 'styled-components';
import transition from 'styled-transition-group';

const ScreenTransition = props => {
  return (
    <ScreenTransitionElement
      in={props.show}
      timeout={props.timeout}
      type={props.type}
      unmountOnExit
    >
      {props.children}
    </ScreenTransitionElement>
  );
};

const showStyles = {
  fade: css`
    opacity: 1;
  `,
  slide: css`
    transform: translateY(0%);
  `
};

const hideStyles = {
  fade: css`
    opacity: 0.01;
  `,
  slide: css`
    transform: translateY(-100%);
  `
};

const ScreenTransitionElement = transition.div.attrs({
  showStyles: props =>
    props.type === 'slide' ? showStyles.slide : showStyles.fade,
  hideStyles: props =>
    props.type === 'slide' ? hideStyles.slide : hideStyles.fade
})`
  &:enter {
    ${props => props.hideStyles}
  }
  &:enter-active {
    ${props => props.showStyles}
    transition: all ${props => props.timeout}ms ease-in-out;
  }
  &:exit {
    ${props => props.showStyles}
  }
  &:exit-active {
    ${props => props.hideStyles}
    transition: all ${props => props.timeout}ms ease-in-out;
  }
`;

export default ScreenTransition;
