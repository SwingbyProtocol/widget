import styled from 'styled-components';
import { em } from 'polished';
import { PulsarConstants } from '@swingby-protocol/pulsar';

import { StylingConstants } from '../styles';

export const SwapContainer = styled.div`
  flex-basis: ${em(StylingConstants.maxWidth)};
  flex-grow: 1;
  flex-shrink: 1;
  box-shadow: 0px 50px 78px -10px rgba(43, 55, 74, 0.152644);
  border-radius: ${em(10)};
  overflow: hidden;
  background: var(--sbpulsar-color-bg-normal);

  @media (min-height: ${em(StylingConstants.media.medium)}) {
    max-width: ${em(StylingConstants.maxWidth)};
    padding: ${em(PulsarConstants.size.city)};
  }

  @media (min-height: ${em(StylingConstants.media.big)}) {
  }
`;
