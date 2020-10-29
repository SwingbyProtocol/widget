import { createGlobalStyle as css } from 'styled-components';

export const GlobalStyles = css`
  :root {
    background: ${({ theme }) => theme.pulsar.color.bg.masked};
  }
`;
