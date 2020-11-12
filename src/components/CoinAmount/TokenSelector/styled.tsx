import styled from 'styled-components';
import { rem } from 'polished';
import { Button, Icon, reset } from '@swingby-protocol/pulsar';

export const VARIANTS = ['banner', 'vertical'] as const;
export type Variant = typeof VARIANTS[number];

export const ButtonCoinCaret = styled(Icon.CaretRight)`
  font-size: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  margin-left: ${({ theme }) => rem(theme.pulsar.size.house)};
  color: ${({ theme }) => theme.pulsar.color.primary.normal};
`;

export const ButtonCoin = styled(Button)`
  border-color: ${({ theme }) => theme.pulsar.components.input.idle.border};
  color: ${({ theme }) => theme.pulsar.color.text.accent};

  :hover,
  :active {
    > ${ButtonCoinCaret} {
      color: inherit;
    }
  }
`;

export const ButtonCoinName = styled.span`
  margin-left: ${({ theme }) => rem(theme.pulsar.size.drawer)};
`;

export const LonelyCoinButton = styled.button`
  ${reset};
  height: ${({ theme }) => rem(theme.pulsar.size.state)};
  font-size: ${({ theme }) => rem(theme.pulsar.size.town)};
  cursor: pointer;
`;
