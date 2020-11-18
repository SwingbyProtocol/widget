import { createGlobalStyle as css } from 'styled-components';

import { StylingConstants } from '../constants';

export const GlobalStyles = css`
  :root {
    background: ${({ theme }) => theme.pulsar.color.bg.normal};
  }

  @media ${StylingConstants.mediaLayout.website} {
    :root {
      background: ${({ theme }) => theme.pulsar.color.bg.masked};
    }
  }
`;
