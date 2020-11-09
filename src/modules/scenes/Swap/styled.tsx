import styled from 'styled-components';
import { Button } from '@swingby-protocol/pulsar';
import { em } from 'polished';

import { StylingConstants } from '../../styles';

export const SwapContainer = styled.div`
  flex-basis: ${em(StylingConstants.maxWidth)};
  flex-grow: 1;
  flex-shrink: 1;
  overflow: hidden;
  background: ${({ theme }) => theme.pulsar.color.bg.normal};
  padding: 0 ${({ theme }) => em(theme.pulsar.size.street)};
  display: flex;
  align-items: center;
  justify-content: center;

  @media (min-height: ${em(StylingConstants.media.medium)}) {
    flex-direction: column;
    padding: ${({ theme }) => em(theme.pulsar.size.city)};
  }

  @media (min-height: ${em(StylingConstants.media.big)}) {
  }

  @media (min-height: ${em(StylingConstants.media.massive)}) {
    max-width: ${em(StylingConstants.maxWidth)};
    box-shadow: 0px 50px 78px -10px rgba(43, 55, 74, 0.152644);
    border-radius: ${em(10)};
  }
`;

export const StyledButton = styled(Button)`
  width: auto;
  margin-left: ${({ theme }) => em(theme.pulsar.size.street)};

  @media (min-height: ${em(StylingConstants.media.medium)}) {
    margin-left: 0;
    margin-top: ${({ theme }) => em(theme.pulsar.size.street)};
  }
`;
