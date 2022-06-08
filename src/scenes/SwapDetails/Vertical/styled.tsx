import { Icon, QRCode } from '@swingby-protocol/pulsar';
import { rem } from 'polished';
import styled from 'styled-components';

import { StylingConstants } from '../../../modules/styles';

export const ExplorerLink = styled.a`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  height: ${({ theme }) => rem(theme.pulsar.size.street)};
  width: 100%;
  flex-shrink: 0;
  font-size: ${({ theme }) => rem(theme.pulsar.size.closet)};
  cursor: pointer;
  text-decoration: none;
  color: inherit;

  :visited {
    text-decoration: none;
    color: inherit;
  }

  @media ${StylingConstants.mediaLayout.widgetFull} {
    height: ${({ theme }) => rem(theme.pulsar.size.country)};
  }
`;

export const ExplorerLinkCaret = styled(Icon.CaretRight)`
  font-size: ${({ theme }) => rem(theme.pulsar.size.drawer)};
  color: ${({ theme }) => theme.pulsar.color.primary.normal};
  margin-left: ${({ theme }) => rem(theme.pulsar.size.drawer)};
`;

export const ProgressContainer = styled.div`
  font-size: ${({ theme }) => rem(theme.pulsar.size.city)};
`;

export const ExplorerContainer = styled.div`
  width: calc(100% + ${rem(StylingConstants.widgetVerticalPadding * 2)});
  margin-left: ${rem(-StylingConstants.widgetVerticalPadding)};
  margin-right: ${rem(-StylingConstants.widgetVerticalPadding)};
  margin-bottom: ${rem(-StylingConstants.widgetVerticalPadding)};
  display: flex;
  justify-content: space-evenly;
  border-top: 1px solid ${({ theme }) => theme.pulsar.color.border.normal};
`;

export const RowLink = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

export const TransferButtonsContainer = styled.div`
  > * {
    width: ${rem(100)};
  }
`;

export const StyledQRCode = styled(QRCode)`
  font-size: ${rem(95)};

  @media ${StylingConstants.mediaLayout.widgetFull} {
    font-size: ${rem(150)};
  }
`;

export const StyledQRContainer = styled.div`
  background: #212223;
  padding: 20px;
`;
