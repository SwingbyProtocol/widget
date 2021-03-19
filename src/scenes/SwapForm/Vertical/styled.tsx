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

export const TermsOfUseContainer = styled.div`
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  margin-bottom: ${({ theme }) => rem(theme.pulsar.size.box)};
  text-align: center;
  font-weight: 400;
`;

export const TermsOfUseLink = styled.a`
  white-space: nowrap;
`;

export const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  width: 100%;
`;

export const ErrorTitle = styled.div`
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  color: ${({ theme }) => theme.pulsar.color.danger.normal};
  margin-bottom: ${({ theme }) => rem(theme.pulsar.size.box)};
`;

export const ErrorBox = styled.div`
  width: 100%;
  border-radius: ${({ theme }) => rem(theme.pulsar.size.box)};
  font-size: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  color: ${({ theme }) => theme.pulsar.color.danger.normal};
  background: ${({ theme }) => theme.pulsar.color.border.danger};
  padding: ${({ theme }) => rem(theme.pulsar.size.box)}
    ${({ theme }) => rem(theme.pulsar.size.drawer)};
`;
