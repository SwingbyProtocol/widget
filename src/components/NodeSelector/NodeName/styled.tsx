import { rem, transitions } from 'polished';
import styled from 'styled-components';

export const NodeNameContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  font-weight: 600;
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
`;

export const FancyDot = styled.div<{ bg: string }>`
  width: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  height: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  margin-right: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  background: ${({ bg }) => bg};
  border-radius: 50%;
  ${({ theme }) => transitions(['background'], theme.pulsar.duration.normal)};
`;
