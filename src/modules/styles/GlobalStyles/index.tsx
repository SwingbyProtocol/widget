import { createGlobalStyle as css } from 'styled-components';

import { StylingConstants } from '../constants';

export const GlobalStyles = css`
  :root {
    background: ${({ theme }) => theme.pulsar.color.bg.normal};
  }

  a,
  a:visited {
    color: inherit;
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.pulsar.color.primary.normal};
  }

  @media ${StylingConstants.mediaLayout.website} {
    :root {
      background: ${({ theme }) => theme.pulsar.color.bg.masked};
    }
  }
`;
