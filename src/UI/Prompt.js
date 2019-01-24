import React from 'react';
import styled, { keyframes } from 'styled-components';

const Prompt = ({ children }) => {
  return <PromptElement>{children}</PromptElement>;
};

const blink = keyframes`
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
`;

const PromptElement = styled.div`
  animation: ${blink} 0.5s ease-in-out infinite alternate;
`;

export default Prompt;
