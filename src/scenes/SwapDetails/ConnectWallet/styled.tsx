import { rem } from 'polished';
import styled from 'styled-components';

import { StylingConstants } from '../../../modules/styles';

export const ConnectWalletView = styled.div`
  display: none;
  @media ${StylingConstants.mediaWideWidth} {
    display: block;
    position: absolute;
    right: ${({ theme }) => rem(theme.pulsar.size.country)};
    top: ${({ theme }) => rem(theme.pulsar.size.street)};
  }
`;
