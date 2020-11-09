import styled, { css } from 'styled-components';
import { em } from 'polished';
import { Icon, TextInput } from '@swingby-protocol/pulsar';

import { StylingConstants } from '../../modules/styles';

export const CoinAmountContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr auto 1fr 1fr;
  column-gap: ${({ theme }) => em(theme.pulsar.size.house)};
  row-gap: ${({ theme }) => em(theme.pulsar.size.house)};

  @media (min-height: ${em(StylingConstants.media.medium)}) {
    width: 100%;
    grid-template-columns: auto 1fr 1fr;
  }
`;

export const Label = styled.span`
  display: none;
  flex-grow: 0;
  flex-shrink: 0;
  font-size: ${({ theme }) => em(theme.pulsar.size.room)};
  place-self: center left;

  @media (min-height: ${em(StylingConstants.media.medium)}) {
    display: block;
  }
`;

const swap = css`
  font-size: ${({ theme }) => em(theme.pulsar.size.house)};
  flex-shrink: 0;
  place-self: center center;

  @media (min-height: ${em(StylingConstants.media.medium)}) {
    grid-column: 1 / 4;
  }
`;

export const SwapVertical = styled(Icon.SwapVertical)`
  ${swap};
`;

export const SwapHorizontal = styled(Icon.SwapHorizontal)`
  ${swap};
`;
