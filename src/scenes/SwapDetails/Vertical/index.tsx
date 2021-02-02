import { Loading, useBuildTestId, SwapProgress } from '@swingby-protocol/pulsar';
import { buildExplorerLink, SkybridgeResource } from '@swingby-protocol/sdk';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Space } from '../../../components/Space';
import { VerticalWidgetView } from '../../../components/VerticalWidgetView';
import { useDetails } from '../../../modules/details';
import { getTransferUriFor } from '../../../modules/send-funds-uri';
import { usePushWithSearchParams } from '../../../modules/push-keeping-search';
import { NodeSelector } from '../../../components/NodeSelector';
import { useWidgetLayout } from '../../../modules/layout';
import { useSdkContext } from '../../../modules/store/sdkContext';

import {
  ExplorerLink,
  ExplorerLinkCaret,
  ProgressContainer,
  ExplorerContainer,
  StyledQRCode,
} from './styled';
import { Top } from './Top';

export const Vertical = ({ resource }: { resource: SkybridgeResource }) => {
  const { buildTestId } = useBuildTestId({ id: 'vertical.swap-details' });
  const { swap } = useDetails({ resource });
  const { push } = usePushWithSearchParams();
  const { locale } = useIntl();
  const context = useSdkContext();
  const layout = useWidgetLayout();

  const explorerLink = useMemo(() => {
    if (!swap || !swap.txReceivingId) return undefined;
    return buildExplorerLink({
      context,
      coin: swap.currencyReceiving,
      transactionId: swap.txReceivingId,
    });
  }, [context, swap]);

  if (!swap) {
    return <Loading data-testid={buildTestId('loading')} />;
  }

  return (
    <VerticalWidgetView
      onClickBack={() => push(`/${context.mode}/${resource}/new`)}
      top={<Top swap={swap} data-testid={buildTestId('')} />}
      data-testid={buildTestId('')}
    >
      {layout === 'website' && <NodeSelector />}

      {swap.status === 'WAITING' && (
        <StyledQRCode
          value={getTransferUriFor({
            address: swap.addressDeposit,
            coin: swap.currencyDeposit,
            amount: swap.amountDeposit,
          })}
        />
      )}
      {swap.status !== 'WAITING' && (
        <ProgressContainer>
          <SwapProgress
            messages={SwapProgress.defaultMessages({ locale })}
            status={swap.status}
            currencyIn={swap.currencyDeposit}
            currencyOut={swap.currencyReceiving}
            data-testid={buildTestId('bottom.step-indicator')}
          />
        </ProgressContainer>
      )}
      {explorerLink && (
        <>
          <Space size="town" shape="fill" />
          <ExplorerContainer>
            <ExplorerLink
              href={explorerLink}
              target="_blank"
              data-testid={buildTestId('explorer-link')}
            >
              <FormattedMessage id="widget.explorer-link-long" />
              <ExplorerLinkCaret />
            </ExplorerLink>
          </ExplorerContainer>
        </>
      )}
    </VerticalWidgetView>
  );
};
