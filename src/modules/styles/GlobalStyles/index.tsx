import { createGlobalStyle as css } from 'styled-components';
import { em } from 'polished';

import { StylingConstants } from '../constants';

export const GlobalStyles = css`
  :root {
    background: ${({ theme }) => theme.pulsar.color.bg.normal};
  }

  @media (min-height: ${em(StylingConstants.media.medium)}) {
    :root {
      background: ${({ theme }) => theme.pulsar.color.bg.masked};
    }
  }
`;
