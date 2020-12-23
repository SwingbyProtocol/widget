import { rem } from 'polished';
import styled from 'styled-components';

import { StylingConstants } from '../../../../modules/styles';

export const BigText = styled.span`
  display: block;
  text-align: center;
  font-weight: 800;
  font-size: ${({ theme }) => rem(theme.pulsar.size.house)};

  @media ${StylingConstants.mediaLayout.widgetFull} {
    font-size: ${({ theme }) => rem(theme.pulsar.size.street)};
  }
`;

export const SmallText = styled.span`
  display: block;
  text-align: center;
  font-weight: 600;
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};

  @media ${StylingConstants.mediaLayout.widgetFull} {
    font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  }
`;

export const CoinWithText = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
