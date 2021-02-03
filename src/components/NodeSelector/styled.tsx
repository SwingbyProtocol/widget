import { Button, Modal } from '@swingby-protocol/pulsar';
import { rem } from 'polished';
import styled from 'styled-components';

export const NodeSelectorContainer = styled.div`
  display: fixed;
  position: absolute;
  bottom: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  right: ${({ theme }) => rem(theme.pulsar.size.drawer)};
`;

export const StyledButton = styled(Button)`
  padding-left: ${({ theme }) => rem(theme.pulsar.size.drawer)};
`;

export const StyledModalContent = styled(Modal.Content)`
  padding: 0;
`;
