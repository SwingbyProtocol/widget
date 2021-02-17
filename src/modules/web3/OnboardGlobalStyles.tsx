import { rem } from 'polished';
import { createGlobalStyle as css } from 'styled-components';

import { StylingConstants } from '../styles';

export const OnboardGlobalStyles = css`
  .bn-onboard-custom {
    .bn-onboard-modal-content {
      max-width: none;
      max-height: none;
      width: calc(100vw - ${rem(StylingConstants.widgetVerticalPadding * 2)});
      height: calc(100vh - ${rem(StylingConstants.widgetVerticalPadding * 2)});
      padding: ${rem(StylingConstants.widgetVerticalPadding)};
      border-radius: 0;

      @media ${StylingConstants.mediaLayout.website} {
        max-width: 37em;
        max-height: none;
        width: auto;
        height: auto;
        padding: ${rem(StylingConstants.widgetVerticalPadding)};
        border-radius: ${({ theme }) => rem(theme.pulsar.size.closet)};
      }
    }
  }
`;
