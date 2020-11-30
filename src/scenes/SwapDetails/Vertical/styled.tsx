import { Icon } from '@swingby-protocol/pulsar';
import { rem } from 'polished';
import styled from 'styled-components';

export const ExplorerLink = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: ${({ theme }) => rem(theme.pulsar.size.country)};
  width: 100%;
  flex-shrink: 0;
  border-top: 1px solid ${({ theme }) => theme.pulsar.color.border.normal};
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  cursor: pointer;
  text-decoration: none;
  color: inherit;

  :visited {
    text-decoration: none;
    color: inherit;
  }
`;

export const ExplorerLinkCaret = styled(Icon.CaretRight)`
  font-size: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  color: ${({ theme }) => theme.pulsar.color.primary.normal};
  margin-left: ${({ theme }) => rem(theme.pulsar.size.drawer)};
`;
