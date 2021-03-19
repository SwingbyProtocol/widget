import styled from 'styled-components';

const TextTutorial = styled.span`
  &,
  &:visited {
    color: ${({ theme }) => theme.pulsar.color.text.normal};
    text-decoration: underline;
    text-decoration-color: ${({ theme }) => theme.pulsar.color.primary.normal};
  }
`;

// Memo: Facing build error if 'export const TextTutorial ='
export default TextTutorial;
