import { Mode } from '@swingby-protocol/sdk';
import { rem } from 'polished';
import styled, { css } from 'styled-components';

const test = css`
  background: ${({ theme }) => theme.pulsar.color.secondary.normal};
  color: ${({ theme }) => theme.pulsar.color.secondary.text};
`;

const chaos = css`
  background: ${({ theme }) => theme.pulsar.color.danger.normal};
  color: ${({ theme }) => theme.pulsar.color.danger.text};
`;

export const ModeWarningContainer = styled.div<{ mode: Mode }>`
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: ${({ theme }) => rem(theme.pulsar.size.street)};
  font-size: ${({ theme }) => rem(theme.pulsar.size.drawer)};

  ${({ mode }) => mode === 'test' && test};
  ${({ mode }) => mode === 'production' && chaos};
`;

export const Link = styled.a`
  color: inherit;

  :visited {
    color: inherit;
  }
`;
