import { Text } from '@swingby-protocol/pulsar';
import { rem } from 'polished';
import styled from 'styled-components';

export const NodeSelectorContainer = styled.div`
  display: fixed;
  position: absolute;
  bottom: ${({ theme }) => rem(theme.pulsar.size.room)};
  right: ${({ theme }) => rem(theme.pulsar.size.room)};
`;

export const TextNode = styled(Text)`
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  padding-right: ${({ theme }) => rem(theme.pulsar.size.box)};
  margin-top: ${({ theme }) => rem(-theme.pulsar.size.box / 2)};
`;
