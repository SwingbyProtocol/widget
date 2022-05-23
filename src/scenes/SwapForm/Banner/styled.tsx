import styled from 'styled-components';
import { rem } from 'polished';
import { TextInput } from '@swingby-protocol/pulsar';

import { StylingConstants } from '../../../modules/styles';

export const BannerContainer = styled.div`
  position: relative;
  flex-grow: 1;
  flex-shrink: 1;
  background: ${({ theme }) => theme.pulsar.color.bg.normal};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: ${rem(StylingConstants.widgetBannerPadding)};
`;

export const AddressInput = styled(TextInput)`
  flex-grow: 1;
`;

export const ResponsiveSpace = styled.div`
  flex-basis: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  flex-shrink: 0;

  @media ${StylingConstants.mediaWideWidth} {
    margin-left: ${({ theme }) => rem(theme.pulsar.size.street)};
  }
`;

export const StakeEarn = styled.span`
  position: fixed;
  bottom: 0;
  left: ${rem(StylingConstants.widgetBannerPadding)};
  font-size: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  height: ${rem(StylingConstants.widgetBannerPadding)};
  display: flex;
  align-items: center;
  justify-content: flex-start;
  font-weight: 600;
`;

export const ErrorBox = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  width: 100%;
  z-index: 1;
  border-radius: ${({ theme }) => rem(theme.pulsar.size.box)};
  font-size: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  color: ${({ theme }) => theme.pulsar.color.danger.normal};
  background: ${({ theme }) => theme.pulsar.color.border.danger};
  padding: ${rem(1)} ${({ theme }) => rem(theme.pulsar.size.drawer)};
`;

export const ErrorTitle = styled.div`
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  color: ${({ theme }) => theme.pulsar.color.danger.normal};
  margin-bottom: ${({ theme }) => rem(theme.pulsar.size.box)};
`;
