import styled from 'styled-components';
import { rem } from 'polished';
import { Button } from '@swingby-protocol/pulsar';

export const HorizontalSelectorBg = styled.div`
  position: fixed;
  background: ${({ theme }) => theme.pulsar.color.bg.normal};
  width: 100vw;
  height: 100vh;
  left: 0;
  top: 0;
  z-index: 1;
  display: flex;
  align-items: center;
  flex-direction: row;
`;

export const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  padding-left: ${({ theme }) => rem(theme.pulsar.size.street)};
  overflow: hidden;
`;

export const CoinList = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  flex: 1;
  overflow: auto;
`;

export const CoinListWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  padding-left: ${({ theme }) => rem(theme.pulsar.size.room)};
  padding-right: ${({ theme }) => rem(theme.pulsar.size.room)};
`;

export const CoinButton = styled(Button)`
  margin-right: ${({ theme }) => rem(theme.pulsar.size.room)};
`;
