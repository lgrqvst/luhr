import { createGlobalStyle } from 'styled-components';

const Base = createGlobalStyle`
  body {
    min-height: 100vh;
    font: 1rem/1 'Rajdhani', sans-serif;
    font-weight: 500;
    background: #222;
    color: white;
  }
`;

export default Base;
