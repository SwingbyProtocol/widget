import { Button, Loading, SwapProgress, useBuildTestId } from '@swingby-protocol/pulsar';
import { buildExplorerLink, SkybridgeResource } from '@swingby-protocol/sdk';
import { Big } from 'big.js';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { NodeSelector } from '../../../components/NodeSelector';
import { Space } from '../../../components/Space';
import { VerticalWidgetView } from '../../../components/VerticalWidgetView';
import { useDetails } from '../../../modules/details';
import { useWidgetLayout } from '../../../modules/layout';
import { logger } from '../../../modules/logger';
import { usePushWithSearchParams } from '../../../modules/push-keeping-search';
import { getTransferUriFor } from '../../../modules/send-funds-uri';
import { useSdkContext } from '../../../modules/store/sdkContext';
import { useAssertTermsSignature } from '../../../modules/terms';
import {
  isWeb3ableCurrency,
  useApproveTokenAllowance,
  useOnboard,
  useTokenAllowance,
  useTransferToken,
} from '../../../modules/web3';

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
  const { push } = usePushWithSearchParams();
  const { locale } = useIntl();
  const context = useSdkContext();
  const layout = useWidgetLayout();
  const { address } = useOnboard();
  const { transfer, loading: isTransferring } = useTransferToken();
  const { approveTokenAllowance, loading: isApproving } = useApproveTokenAllowance();
  const [hasTransactionSucceeded, setTransactionSucceeded] = useState(false);
  const { allowance, recheck: recheckAllowance } = useTokenAllowance({
    currency: swap?.currencyDeposit,
    spenderAddress: swap?.addressDeposit,
  });
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
      const result = await transfer({ swap });
      setTransactionSucceeded(result.status);
    } catch (err) {
      logger.error({ err });
    }
  }, [transfer, swap]);

  const doApprove = useCallback(async () => {
    if (!swap) return;

    try {
      await assertTermsSignature();
      await approveTokenAllowance({
        currency: swap.currencyDeposit,
        spenderAddress: swap.addressDeposit,
        amount: swap.amountDeposit,
      });
      recheckAllowance();
    } catch (err) {
      logger.error({ err });
    }
  }, [swap, approveTokenAllowance, recheckAllowance, assertTermsSignature]);

  const needsApproval = useMemo(
    () =>
      typeof allowance !== 'string' ||
      !swap?.amountDeposit ||
      new Big(allowance).lt(swap.amountDeposit),
    [allowance, swap?.amountDeposit],
  );

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
      onClickBack={() => push(`/${context.mode}/${resource}/new`)}
      top={<Top swap={swap} data-testid={buildTestId('')} />}
      data-testid={buildTestId('')}
    >
      {layout === 'website' && <NodeSelector swap={swap} />}

      {address && swap.status === 'WAITING' && (isTransferring || hasTransactionSucceeded) && (
        <Loading />
      )}
      {address &&
        supportsWeb3 &&
        swap.status === 'WAITING' &&
        !isTransferring &&
        !hasTransactionSucceeded && (
          <TransferButtonsContainer>
            <Button
              variant={!needsApproval ? 'secondary' : 'primary'}
              size="city"
              shape="fit"
              onClick={doApprove}
              disabled={isApproving || !needsApproval}
            >
              {isApproving ? (
                <Loading />
              ) : (
                <FormattedMessage
                  id="widget.onboard.approve-btn"
                  values={{ symbol: swap.currencyDeposit }}
                />
              )}
            </Button>
            <Button
              variant="primary"
              size="city"
              shape="fit"
              onClick={doTransfer}
              disabled={needsApproval}
            >
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
