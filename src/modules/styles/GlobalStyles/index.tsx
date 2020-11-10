import { createGlobalStyle as css } from 'styled-components';
import { rem } from 'polished';

import { StylingConstants } from '../constants';

export const GlobalStyles = css`
  :root {
    background: ${({ theme }) => theme.pulsar.color.bg.normal};
  }

  body {
    margin: 0 ${({ theme }) => rem(theme.pulsar.size.street)};
  }

  @media (${StylingConstants.mediaLayout.widgetSmall}) {
    body {
      margin: ${({ theme }) => rem(theme.pulsar.size.city)};
    }
  }

  @media (${StylingConstants.mediaLayout.website}) {
    :root {
      background: ${({ theme }) => theme.pulsar.color.bg.masked};
    }
  }
`;
