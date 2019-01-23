import React from 'react';
import styled from 'styled-components';

const Canvas = React.forwardRef((props, ref) => (
  <CanvasElement ref={ref} depth={props.depth} />
));

const CanvasElement = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  z-index: ${props => props.depth};
  width: 100vw;
  height: 100vh;
`;

export default Canvas;
