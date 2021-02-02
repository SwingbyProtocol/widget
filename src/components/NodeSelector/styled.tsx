import { rem } from 'polished';
import styled from 'styled-components';

export const NodeSelectorContainer = styled.div`
  display: fixed;
  position: absolute;
  bottom: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  right: ${({ theme }) => rem(theme.pulsar.size.drawer)};
`;
