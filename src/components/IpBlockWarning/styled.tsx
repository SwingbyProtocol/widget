import { rem } from 'polished';
import styled from 'styled-components';

export const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: ${({ theme }) => theme.pulsar.color.bg.transparent};
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  max-width: ${rem(300)};
`;

export const Warning = styled.div`
  font-size: ${({ theme }) => rem(theme.pulsar.size.room)};
  font-weight: 600;
`;

export const Countries = styled.div`
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  font-weight: 600;
`;
