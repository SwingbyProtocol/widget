import styled from 'styled-components';
import { rem } from 'polished';
import { TextInput } from '@swingby-protocol/pulsar';

import { StylingConstants } from '../../../modules/styles';

export const BannerContainer = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  background: ${({ theme }) => theme.pulsar.color.bg.normal};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${rem(StylingConstants.widgetBannerPadding)};
`;

export const AddressInput = styled(TextInput)`
  flex-grow: 1;
`;

export const SendTo = styled.div`
  display: flex;
  flex-direction: column;
`;

export const SendToLabel = styled.span`
  white-space: nowrap;
  font-size: ${({ theme }) => rem(theme.pulsar.size.room)};
  font-weight: 700;
`;

export const SendToValue = styled.span`
  white-space: nowrap;
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  font-weight: 700;
`;

export const ResponsiveSpace = styled.div`
  flex-basis: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  flex-shrink: 0;

  @media (${StylingConstants.mediaWideWidth}) {
    margin-left: ${({ theme }) => rem(theme.pulsar.size.street)};
  }
`;
