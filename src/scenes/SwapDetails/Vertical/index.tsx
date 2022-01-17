import { Button, Loading, SwapProgress, useBuildTestId } from '@swingby-protocol/pulsar';
import { buildExplorerLink, SkybridgeResource } from '@swingby-protocol/sdk';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Space } from '../../../components/Space';
import { VerticalWidgetView } from '../../../components/VerticalWidgetView';
import { useDetails } from '../../../modules/details';
import { logger } from '../../../modules/logger';
import { getTransferUriFor } from '../../../modules/send-funds-uri';
import { useSdkContext } from '../../../modules/store/sdkContext';
import { useAssertTermsSignature } from '../../../modules/terms';
import { isWeb3ableCurrency, useOnboard, useTransferToken } from '../../../modules/web3';

import {
  ExplorerContainer,
  ExplorerLink,
  ExplorerLinkCaret,
  ProgressContainer,
  RowLink,
  StyledQRCode,
  TransferButtonsContainer,
} from './styled';
import { Top } from './Top';

export const Vertical = ({ resource }: { resource: SkybridgeResource }) => {
  const { buildTestId } = useBuildTestId({ id: 'vertical.swap-details' });
  const { swap } = useDetails();
  const { push } = useRouter();
  const { locale } = useIntl();
  const context = useSdkContext();
  const { address } = useOnboard();
  const { transfer, loading: isTransferring } = useTransferToken();
  const [hasTransactionSucceeded, setTransactionSucceeded] = useState(false);
  const { assertTermsSignature } = useAssertTermsSignature();

  const outboundLink = useMemo(() => {
    if (!swap || !swap.txReceivingId) return undefined;
    return buildExplorerLink({
      context,
      coin: swap.currencyReceiving,
      transactionId: swap.txReceivingId,
    });
  }, [context, swap]);

  const inboundLink = useMemo(() => {
    if (!swap || !swap.txDepositId) return undefined;
    return buildExplorerLink({
      context,
      coin: swap.currencyDeposit,
      transactionId: swap.txDepositId,
    });
  }, [context, swap]);

  const doTransfer = useCallback(async () => {
    try {
      await assertTermsSignature();
      const result = await transfer({ swap });
      setTransactionSucceeded(result.status);
    } catch (err) {
      logger.error({ err });
    }
  }, [transfer, swap, assertTermsSignature]);

  if (!swap) {
    return <Loading data-testid={buildTestId('loading')} />;
  }

  const supportsWeb3 = isWeb3ableCurrency(swap.currencyDeposit);

  const explorerLink = ({ url, txType }: { url: string; txType: 'inbound' | 'outbound' }) => (
    <div>
      <ExplorerLink href={url} target="_blank" data-testid={buildTestId('explorer-link')}>
        <RowLink>
          <FormattedMessage
            id={txType === 'inbound' ? 'widget.explorer-deposit' : 'widget.explorer-swap'}
          />
          <div>
            <FormattedMessage id="widget.explorer-link-long" />
            <ExplorerLinkCaret />
          </div>
        </RowLink>
      </ExplorerLink>
    </div>
  );

  return (
    <VerticalWidgetView
      onClickBack={() => {
        console.log(`/${context.mode}/${resource}/new`);
        push(`/${context.mode}/${resource}/new`);
      }}
      top={<Top swap={swap} data-testid={buildTestId('')} />}
      data-testid={buildTestId('')}
    >
      {address && swap.status === 'WAITING' && (isTransferring || hasTransactionSucceeded) && (
        <Loading />
      )}
      {address &&
        supportsWeb3 &&
        swap.status === 'WAITING' &&
        !isTransferring &&
        !hasTransactionSucceeded && (
          <TransferButtonsContainer>
            <Button variant="primary" size="city" shape="fit" onClick={doTransfer}>
              <FormattedMessage id="widget.onboard.transfer-btn" />
            </Button>
          </TransferButtonsContainer>
        )}
      {(!address || !supportsWeb3) &&
        swap.status === 'WAITING' &&
        !isTransferring &&
        !hasTransactionSucceeded && (
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
      <>
        <Space size="town" shape="fill" />
        <ExplorerContainer>
          {inboundLink && explorerLink({ url: inboundLink, txType: 'inbound' })}
          {outboundLink && explorerLink({ url: outboundLink, txType: 'outbound' })}
        </ExplorerContainer>
      </>
    </VerticalWidgetView>
  );
};
