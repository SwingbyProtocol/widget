import { createGlobalStyle as css } from 'styled-components';
import { em } from 'polished';

import { StylingConstants } from '../constants';

export const GlobalStyles = css`
  :root {
    background: ${({ theme }) => theme.pulsar.color.bg.normal};
  }

  body {
    margin: 0 ${({ theme }) => em(theme.pulsar.size.street)};
  }

  @media (min-height: ${em(StylingConstants.mediaHeight.medium)}) {
    body {
      margin: ${({ theme }) => em(theme.pulsar.size.city)};
    }
  }

  @media (min-height: ${em(StylingConstants.mediaHeight.massive)}) {
    :root {
      background: ${({ theme }) => theme.pulsar.color.bg.masked};
    }
  }
`;
