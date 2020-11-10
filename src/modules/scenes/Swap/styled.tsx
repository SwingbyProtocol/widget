import styled from 'styled-components';
import { Button } from '@swingby-protocol/pulsar';
import { rem } from 'polished';

import { StylingConstants } from '../../styles';

export const SwapContainer = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  background: ${({ theme }) => theme.pulsar.color.bg.normal};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (${StylingConstants.mediaLayout.widgetSmall}) {
    flex-direction: column;
  }

  @media (${StylingConstants.mediaLayout.widgetFull}) {
  }

  @media (${StylingConstants.mediaLayout.website}) {
    max-width: ${rem(445)};
    box-shadow: 0px 50px 78px -10px rgba(43, 55, 74, 0.152644);
    border-radius: ${rem(10)};
  }
`;

export const StyledButton = styled(Button)`
  width: auto;
  margin-left: ${({ theme }) => rem(theme.pulsar.size.street)};

  @media (${StylingConstants.mediaLayout.widgetSmall}) {
    margin-left: 0;
    margin-top: ${({ theme }) => rem(theme.pulsar.size.street)};
  }
`;
