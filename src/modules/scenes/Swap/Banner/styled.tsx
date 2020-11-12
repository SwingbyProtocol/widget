import styled from 'styled-components';
import { rem } from 'polished';
import { TextInput } from '@swingby-protocol/pulsar';

import { StylingConstants } from '../../../styles';

export const BannerContainer = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  background: ${({ theme }) => theme.pulsar.color.bg.normal};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const AddressInput = styled(TextInput)`
  flex-grow: 1;
`;

export const Space = styled.div`
  flex-basis: ${({ theme }) => rem(theme.pulsar.size.drawer)};

  @media (${StylingConstants.mediaWideWidth}) {
    margin-left: ${({ theme }) => rem(theme.pulsar.size.street)};
  }
`;
