import React from 'react';
import styled from 'styled-components';

const ScreenWrapper = ({ children }) => {
  return <ScreenWrapperElement>{children}</ScreenWrapperElement>;
};

const ScreenWrapperElement = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  text-align: center;
  min-height: 100vh;
`;

export default ScreenWrapper;
