import styled from 'styled-components';
import { rem } from 'polished';

import { StylingConstants } from '../../../modules/styles';

export const SwapContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;

  @media ${StylingConstants.mediaLayout.website} {
    padding: ${({ theme }) => rem(theme.pulsar.size.city)};
  }
`;
