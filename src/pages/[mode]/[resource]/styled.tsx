import styled from 'styled-components';

export const TextTutorial = styled.span`
  &,
  &:visited {
    color: ${({ theme }) => theme.pulsar.color.text.normal};
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.pulsar.color.primary.normal};
  }
`;
