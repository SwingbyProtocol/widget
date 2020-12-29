import { rem } from 'polished';
import styled from 'styled-components';

export const StakeEarn = styled.span`
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  margin-top: ${({ theme }) => rem(theme.pulsar.size.box)};
  font-weight: 600;

  &,
  &:visited {
    color: ${({ theme }) => theme.pulsar.color.text.normal};
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.pulsar.color.primary.normal};
  }
`;
