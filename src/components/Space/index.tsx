import { PulsarThemeType } from '@swingby-protocol/pulsar';
import styled, { css } from 'styled-components';
import { rem } from 'polished';

import { StylingConstants } from '../../modules/styles';

type Props = {
  size: keyof PulsarThemeType['pulsar']['size'] | 'widgetBannerPadding' | 'widgetVerticalPadding';
  shape?: 'fit' | 'fill';
};

const fill = css`
  flex-grow: 1;
`;

const bannerPadding = css`
  width: ${rem(StylingConstants.widgetBannerPadding)};
  height: ${rem(StylingConstants.widgetBannerPadding)};
`;

const verticalPadding = css`
  width: ${rem(StylingConstants.widgetVerticalPadding)};
  height: ${rem(StylingConstants.widgetVerticalPadding)};
`;

export const Space = styled.div<Props>`
  width: ${// @ts-expect-error
  ({ theme, size }) => rem(theme.pulsar.size[size])};
  height: ${// @ts-expect-error
  ({ theme, size }) => rem(theme.pulsar.size[size])};
  ${({ size }) => size === 'widgetBannerPadding' && bannerPadding};
  ${({ size }) => size === 'widgetVerticalPadding' && verticalPadding};
  ${({ shape }) => shape === 'fill' && fill};
`;
