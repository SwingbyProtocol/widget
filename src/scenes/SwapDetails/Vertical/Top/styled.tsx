import { rem } from 'polished';
import styled from 'styled-components';

export const BigText = styled.span`
  display: block;
  text-align: center;
  font-weight: 800;
  font-size: ${({ theme }) => rem(theme.pulsar.size.house)};
`;

export const SmallText = styled.span`
  display: block;
  text-align: center;
  font-weight: 600;
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  line-height: 1.5em;
`;

export const FeeText = styled.span`
  display: block;
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  line-height: 1.5em;
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
