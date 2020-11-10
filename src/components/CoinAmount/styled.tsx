import styled, { css } from 'styled-components';
import { rem } from 'polished';
import { Icon } from '@swingby-protocol/pulsar';

import { StylingConstants } from '../../modules/styles';

export const CoinAmountContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto 1fr 1fr;
  column-gap: ${({ theme }) => rem(theme.pulsar.size.house)};
  row-gap: ${({ theme }) => rem(theme.pulsar.size.house)};
  width: 100%;

  @media (${StylingConstants.mediaLayout.widgetSmall}) {
    grid-template-columns: auto 1fr 1fr;
  }
`;

export const Label = styled.span`
  display: none;
  flex-grow: 0;
  flex-shrink: 0;
  font-size: ${({ theme }) => rem(theme.pulsar.size.room)};
  place-self: center left;

  @media (${StylingConstants.mediaLayout.widgetSmall}) {
    display: block;
  }
`;

const swap = css`
  font-size: ${({ theme }) => rem(theme.pulsar.size.house)};
  flex-shrink: 0;
  place-self: center center;

  @media (${StylingConstants.mediaLayout.widgetSmall}) {
    grid-column: 1 / 4;
  }
`;

export const SwapVertical = styled(Icon.SwapVertical)`
  ${swap};
`;

export const SwapHorizontal = styled(Icon.SwapHorizontal)`
  ${swap};
`;
