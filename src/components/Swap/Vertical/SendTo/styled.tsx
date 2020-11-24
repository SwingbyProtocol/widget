import styled from 'styled-components';
import { rem } from 'polished';

export const SendLabel = styled.span`
  display: block;
  text-align: center;
  font-weight: 800;
  font-size: ${({ theme }) => rem(theme.pulsar.size.street)};
  margin-bottom: ${({ theme }) => rem(theme.pulsar.size.town)};
`;