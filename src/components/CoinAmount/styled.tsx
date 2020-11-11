import styled, { css } from 'styled-components';
import { rem } from 'polished';
import { Icon } from '@swingby-protocol/pulsar';

import { StylingConstants } from '../../modules/styles';

export const VARIANTS = ['banner', 'vertical'] as const;
export type Variant = typeof VARIANTS[number];

const wideSpace = css`
  column-gap: ${({ theme }) => rem(theme.pulsar.size.house)};
  row-gap: ${({ theme }) => rem(theme.pulsar.size.house)};
`;

const vertical = css`
  grid-template-columns: auto 1fr 1fr;
`;

const wideBanner = css`
  @media (${StylingConstants.mediaWideWidth}) {
    grid-template-columns: 1fr 1fr auto 1fr 1fr;
    ${wideSpace};
  }
`;

export const CoinAmountContainer = styled.div<{ variant: Variant }>`
  display: grid;
  grid-template-columns: auto 1fr auto auto 1fr;
  column-gap: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  row-gap: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  align-items: center;
  width: 100%;
  ${({ variant }) => variant === 'vertical' && vertical};
  ${({ variant }) => variant === 'vertical' && wideSpace};
  ${({ variant }) => variant === 'banner' && wideBanner};
`;

export const Label = styled.span`
  display: block;
  flex-grow: 0;
  flex-shrink: 0;
  font-size: ${({ theme }) => rem(theme.pulsar.size.room)};
  place-self: center left;
`;

const swap = css`
  font-size: ${({ theme }) => rem(theme.pulsar.size.house)};
  flex-shrink: 0;
  place-self: center center;
`;

export const SwapVertical = styled(Icon.SwapVertical)`
  ${swap};
  grid-column: 2 / 4;
`;

export const SwapHorizontal = styled(Icon.SwapHorizontal)`
  ${swap};
`;
