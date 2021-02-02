import { Button } from '@swingby-protocol/pulsar';
import { rem, transitions } from 'polished';
import styled from 'styled-components';

export const NodeSelectorContainer = styled.div`
  display: fixed;
  position: absolute;
  bottom: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  right: ${({ theme }) => rem(theme.pulsar.size.drawer)};
`;

export const StyledButton = styled(Button)`
  padding-right: 0;
`;

export const FancyDot = styled.div<{ bg: string }>`
  width: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  height: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  margin: 0 ${({ theme }) => rem(theme.pulsar.size.drawer)};
  background: ${({ bg }) => bg};
  border-radius: 50%;
  ${({ theme }) => transitions(['background'], theme.pulsar.duration.normal)};
`;
