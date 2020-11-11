import styled from 'styled-components';
import { rem } from 'polished';
import { Icon } from '@swingby-protocol/pulsar';

export const VARIANTS = ['banner', 'vertical'] as const;
export type Variant = typeof VARIANTS[number];

export const ButtonCoinCaret = styled(Icon.CaretRight)`
  font-size: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  margin-left: ${({ theme }) => rem(theme.pulsar.size.house)};
`;

export const ButtonCoinName = styled.span`
  margin-left: ${({ theme }) => rem(theme.pulsar.size.drawer)};
`;
