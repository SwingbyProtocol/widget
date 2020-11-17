import styled from 'styled-components';
import { rem } from 'polished';
import { logos } from '@swingby-protocol/pulsar';

import { BackButton } from '../../../../../components/BackButton';

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
  background-repeat: no-repeat;
  padding: 0 ${({ theme }) => rem(theme.pulsar.size.city)};
  width: 100%;
`;

export const TopContent = styled.div``;

export const LightTopContainer = styled.div`
  padding: 0 ${({ theme }) => rem(theme.pulsar.size.city)};
`;

export const BottomContainer = styled.div`
  padding: 0 ${({ theme }) => rem(theme.pulsar.size.city)};
  width: 100%;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
