import styled from 'styled-components';
import { em } from 'polished';
import { TextInput } from '@swingby-protocol/pulsar';

import { StylingConstants } from '../../modules/styles';

export const CoinAmountContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const Label = styled.span`
  display: none;
  margin-right: ${({ theme }) => em(theme.pulsar.size.house, theme.pulsar.size.room)};
  flex-grow: 0;
  flex-shrink: 0;
  font-size: ${({ theme }) => em(theme.pulsar.size.room)};

  @media (min-height: ${em(StylingConstants.media.medium)}) {
    display: block;
  }
`;

export const StyledTextInput = styled(TextInput)`
  flex-grow: 1;
  flex-shrink: 1;

  :not(:last-of-type) {
    margin-right: ${({ theme }) => em(theme.pulsar.size.house)};
  }
`;
