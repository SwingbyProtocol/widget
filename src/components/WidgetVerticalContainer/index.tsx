import styled from 'styled-components';
import { rem } from 'polished';

import { StylingConstants } from '../../modules/styles';

export const WidgetVerticalContainer = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  background: ${({ theme }) => theme.pulsar.color.bg.normal};
  display: flex;
  align-self: stretch;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;

  @media ${StylingConstants.mediaLayout.widgetSmall} {
    max-height: ${rem(375)};
  }

  @media ${StylingConstants.mediaLayout.widgetFull} {
    max-height: ${rem(510)};
  }

  @media ${StylingConstants.mediaLayout.website} {
    align-self: center;
    max-width: ${rem(445)};
    min-height: ${rem(500)};
    max-height: 0;
    box-shadow: 0px 50px 78px -10px rgba(43, 55, 74, 0.152644);
    border-radius: ${rem(10)};
    overflow: hidden;
  }
`;
