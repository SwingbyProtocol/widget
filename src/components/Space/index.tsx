import { PulsarThemeType } from '@swingby-protocol/pulsar';
import styled, { css } from 'styled-components';
import { rem } from 'polished';

type Props = {
  size: keyof PulsarThemeType['pulsar']['size'];
  shape?: 'fit' | 'fill';
};

const fill = css`
  flex-grow: 1;
`;

export const Space = styled.div<Props>`
  width: ${({ theme, size }) => rem(theme.pulsar.size[size])};
  height: ${({ theme, size }) => rem(theme.pulsar.size[size])};
  ${({ shape }) => shape === 'fill' && fill};
`;
