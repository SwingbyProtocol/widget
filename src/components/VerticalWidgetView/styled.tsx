import styled, { css } from 'styled-components';
import { rem } from 'polished';
import { logos } from '@swingby-protocol/pulsar';

import { BackButton } from '../BackButton';
import { StylingConstants } from '../../modules/styles';

export const Container = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  background: ${({ theme }) => theme.pulsar.color.bg.normal};
  display: flex;
  align-self: stretch;
  align-items: flex-start;
  justify-content: center;
  flex-direction: column;

  @media ${StylingConstants.mediaLayout.website} {
    align-self: center;
    max-width: ${rem(445)};
    min-height: ${rem(500)};
    box-shadow: 0px 50px 78px -10px rgba(43, 55, 74, 0.152644);
    border-radius: ${rem(10)};
    overflow: hidden;
  }
`;

export const StepViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  flex: 1;
  width: 100%;
`;

export const StyledBackButton = styled(BackButton)`
  margin-bottom: ${({ theme }) => rem(theme.pulsar.size.room)};
`;

export const FancyTopContainer = styled.div`
  background: ${({ theme }) => theme.pulsar.color.bg.normal};
  color: ${({ theme }) => theme.pulsar.color.text.normal};
  background-image: url(${logos.StarsBg});
  background-position: top right;
  background-size: 100%;
  background-repeat: repeat;
  padding: 0 ${rem(StylingConstants.widgetVerticalPadding)};
  width: 100%;
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
`;

export const TopContent = styled.div`
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const LightTopContainer = styled.div`
  padding: 0 ${rem(StylingConstants.widgetVerticalPadding)};
  flex-grow: 1;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
`;

const noTop = css`
  flex-grow: 1;
`;

export const BottomContainer = styled.div<{ hasNoTop: boolean }>`
  padding: 0 ${rem(StylingConstants.widgetVerticalPadding)};
  width: 100%;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${({ hasNoTop }) => hasNoTop && noTop};
`;
