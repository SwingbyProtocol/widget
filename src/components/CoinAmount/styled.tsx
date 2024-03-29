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
  grid-template-columns: 1fr 1fr;

  @media ${StylingConstants.mediaVerticalWideWidth} {
    grid-template-columns: auto 1fr 1fr;
    ${wideSpace};
  }

  @media ${StylingConstants.mediaLayout.widgetFull} {
    grid-template-columns: 1fr 1fr;
  }

  @media ${StylingConstants.mediaWebsiteWideWidth} {
    grid-template-columns: auto 1fr 1fr;
    ${wideSpace};
  }
`;

const wideBanner = css`
  @media ${StylingConstants.mediaWideWidth} {
    grid-template-columns: 1fr 1fr auto 1fr 1fr;
    column-gap: ${({ theme }) => rem(theme.pulsar.size.house)};
    row-gap: 0;
  }
`;

const bannerSwapFeeLabel = css`
  margin: 0;
  min-height: ${({ theme }) => rem(theme.pulsar.size.house)};
  white-space: nowrap;
`;

export const CoinAmountContainer = styled.div<{ variant: Variant }>`
  display: grid;
  grid-template-columns: auto 1fr auto auto 1fr;
  column-gap: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  row-gap: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  align-items: center;
  width: 100%;
  ${({ variant }) => variant === 'vertical' && vertical};
  ${({ variant }) => variant === 'banner' && wideBanner};
`;

export const Label = styled.span`
  display: none;
  flex-grow: 0;
  flex-shrink: 0;
  font-size: ${({ theme }) => rem(theme.pulsar.size.room)};
  place-self: center left;

  @media ${StylingConstants.mediaVerticalWideWidth} {
    display: block;
  }

  @media ${StylingConstants.mediaLayout.widgetFull} {
    display: none;
  }

  @media ${StylingConstants.mediaWebsiteWideWidth} {
    display: block;
  }
`;

const swap = css`
  font-size: ${({ theme }) => rem(theme.pulsar.size.house)};
  flex-shrink: 0;
  place-self: center center;
`;

export const SwapVertical = styled(Icon.SwapVertical)`
  ${swap};
  grid-column: 1 / 3;
  cursor: pointer;

  @media ${StylingConstants.mediaVerticalWideWidth} {
    grid-column: 2 / 2;
  }

  @media ${StylingConstants.mediaLayout.widgetFull} {
    grid-column: 1 / 2;
  }

  @media ${StylingConstants.mediaWebsiteWideWidth} {
    grid-column: 2 / 2;
  }
`;

export const SwapHorizontal = styled(Icon.SwapHorizontal)`
  ${swap};
  cursor: pointer;
`;

export const SwapFeeLabel = styled.span<{ variant: Variant }>`
  ${swap};
  margin-left: ${({ theme }) => rem(theme.pulsar.size.house)};
  margin-top: ${({ theme }) => rem(-theme.pulsar.size.drawer)};
  margin-bottom: ${({ theme }) => rem(-theme.pulsar.size.drawer)};
  min-height: ${({ theme }) => rem(theme.pulsar.size.town)};
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  color: ${({ theme }) => theme.pulsar.color.text.accent};
  place-self: stretch;
  grid-column: 2 / 3;

  ${({ variant }) => variant === 'banner' && bannerSwapFeeLabel};
  ${({ variant }) =>
    variant === 'vertical' &&
    `
  @media ${StylingConstants.mediaVerticalWideWidth} {
    grid-column: 1 / 2;
  }

  @media ${StylingConstants.mediaLayout.widgetSmall} {
    grid-column: 3 / 4;
  }

  @media ${StylingConstants.mediaLayout.widgetFull} {
    grid-column: 2 / 3;
  }

  @media ${StylingConstants.mediaWebsiteWideWidth} {
    grid-column: 3 / 4;
  }`}
`;

export const SwapFeeLabelSmall = styled.span`
  font-size: 0.8em;
`;

export const AmountReceiving = styled.span`
  font-size: ${({ theme }) => rem(theme.pulsar.size.room)};
  font-weight: 700;
  color: ${({ theme }) => theme.pulsar.color.text.accent};
  padding: 0 ${({ theme }) => rem(theme.pulsar.size.room)};
  position: relative;
`;

export const RewardAmountReceiving = styled.span<{ variant: Variant }>`
  display: block;
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  font-weight: 500;
  color: ${({ theme }) => theme.pulsar.color.text.accent};

  ${({ variant }) =>
    variant === 'banner' &&
    `
    grid-column: 5 / 6;
    place-self: stretch;
    `}
  ${({ variant, theme }) =>
    variant === 'vertical' &&
    `
    margin-top: ${rem(theme.pulsar.size.box)};
    margin-bottom: ${rem(-theme.pulsar.size.street)};
    margin-right: ${rem(-theme.pulsar.size.room)};
    `}
`;

export const RewardAmountReceivingSmall = styled.span`
  font-size: 0.8em;
`;

export const Atag = styled.a`
  text-decoration: none;
  color: ${({ theme }) => theme.pulsar.color.primary.active} !important;
`;

export const SbBtcPriceNotation = styled.span<{ variant: Variant }>`
  display: block;
  font-weight: 500;
  white-space: nowrap;
  color: ${({ theme }) => theme.pulsar.color.text.accent};
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};

  ${({ variant }) =>
    variant === 'banner' &&
    `
    grid-column: 5 / 6;
    place-self: stretch;
    `}
  ${({ variant, theme }) =>
    variant === 'vertical' &&
    `
    margin-top: ${rem(theme.pulsar.size.box)};
    margin-bottom: ${rem(-theme.pulsar.size.street)};
    margin-right: ${rem(-theme.pulsar.size.room)};
    `}
`;

export const SbBtcPriceNotationSmall = styled.span`
  font-size: 0.8em;
`;

export const SbBtcPrice = styled.span`
  color: ${({ theme }) => theme.pulsar.color.primary.active} !important;
`;
