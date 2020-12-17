import { rem } from 'polished';
import styled from 'styled-components';

export const BigText = styled.span`
  display: block;
  text-align: center;
  font-weight: 800;
  font-size: ${({ theme }) => rem(theme.pulsar.size.street)};
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

export const AddressAndQr = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;
