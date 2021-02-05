import { rem } from 'polished';
import styled from 'styled-components';

export const ConnectWalletView = styled.div`
  position: fixed;
  right: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  top: ${({ theme }) => rem(theme.pulsar.size.drawer)};
`;
