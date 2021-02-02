import { Dropdown, Text } from '@swingby-protocol/pulsar';
import { rem } from 'polished';
import styled from 'styled-components';

import { StylingConstants } from '../../modules/styles';

export const NodeSelectorView = styled.div`
  display: none;
  @media ${StylingConstants.mediaVerticalWideWidth} {
    display: block;
    position: absolute;
    top: ${({ theme }) => rem(theme.pulsar.size.room)};
    right: ${({ theme }) => rem(theme.pulsar.size.country)};
  }
`;

export const TextNode = styled(Text)`
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  padding-right: ${({ theme }) => rem(theme.pulsar.size.box)};
  margin-top: ${({ theme }) => rem(-theme.pulsar.size.box / 2)};
`;

export const DropTargetNode = styled(Dropdown.DefaultTarget)`
  padding-left: ${({ theme }) => rem(theme.pulsar.size.house)};
  padding-right: ${({ theme }) => rem(theme.pulsar.size.closet)};
`;
