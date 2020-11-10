import styled from 'styled-components';
import { Button } from '@swingby-protocol/pulsar';
import { rem } from 'polished';

export const BannerContainer = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  background: ${({ theme }) => theme.pulsar.color.bg.normal};
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const StyledButton = styled(Button)`
  width: auto;
  margin-left: ${({ theme }) => rem(theme.pulsar.size.street)};
`;
