import { Mode } from '@swingby-protocol/sdk';
import { rem } from 'polished';
import styled, { css } from 'styled-components';
import { StylingConstants } from '../../modules/styles';

const test = css`
  background: ${({ theme }) => theme.pulsar.color.secondary.normal};
  color: ${({ theme }) => theme.pulsar.color.secondary.text};
`;

const chaos = css`
  background: ${({ theme }) => theme.pulsar.color.danger.normal};
  color: ${({ theme }) => theme.pulsar.color.danger.text};
`;

export const ModeWarningContainer = styled.div<{ mode: Mode }>`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${rem(1)} ${rem(StylingConstants.widgetBannerPadding)};
  width: calc(100% - ${rem(StylingConstants.widgetBannerPadding * 2)});
  height: ${({ theme }) => rem(theme.pulsar.size.closet)};
  font-size: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  border-radius: 2px;

  ${({ mode }) => mode === 'test' && test};
  ${({ mode }) => mode === 'production' && chaos};

  @media ${StylingConstants.mediaLayout.widgetSmall} {
    border-radius: 0;
    margin: 0;
    width: 100%;
    height: ${({ theme }) => rem(theme.pulsar.size.street)};
    font-size: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  }
`;

export const Link = styled.a`
  color: inherit;

  :visited {
    color: inherit;
  }
`;
