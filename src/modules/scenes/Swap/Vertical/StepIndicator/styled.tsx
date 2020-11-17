import styled from 'styled-components';
import { rem } from 'polished';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const ProgressContainer = styled.div`
  max-width: ${rem(250)};
`;
