import { Loading, useBuildTestId, SwapProgress, Button } from '@swingby-protocol/pulsar';
import { buildExplorerLink, SkybridgeResource, getChainFor } from '@swingby-protocol/sdk';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Big } from 'big.js';

import { Space } from '../../../components/Space';
import { VerticalWidgetView } from '../../../components/VerticalWidgetView';
import { useDetails } from '../../../modules/details';
import { getTransferUriFor } from '../../../modules/send-funds-uri';
import { usePushWithSearchParams } from '../../../modules/push-keeping-search';
import { NodeSelector } from '../../../components/NodeSelector';
import { useWidgetLayout } from '../../../modules/layout';
import { useSdkContext } from '../../../modules/store/sdkContext';
import { ConnectWallet } from '../ConnectWallet';
import {
  useTokenAllowance,
  useOnboard,
  useTransferToken,
  useApproveTokenAllowance,
} from '../../../modules/web3';
import { logger } from '../../../modules/logger';

import {
  ExplorerLink,
  ExplorerLinkCaret,
  ProgressContainer,
  ExplorerContainer,
  StyledQRCode,
  TransferButtonsContainer,
} from './styled';
import { Top } from './Top';

export const Vertical = ({ resource }: { resource: SkybridgeResource }) => {
  const { buildTestId } = useBuildTestId({ id: 'vertical.swap-details' });
  const { swap } = useDetails({ resource });
  const { push } = usePushWithSearchParams();
  const { locale } = useIntl();
  const context = useSdkContext();
  const layout = useWidgetLayout();
  const { address } = useOnboard();
  const { transfer, loading: isTransferring } = useTransferToken();
  const { approveTokenAllowance, loading: isApproving } = useApproveTokenAllowance();
  const [hasTransactionSucceeded, setTransactionSucceded] = useState(false);
  const { allowance, recheck: recheckAllowance } = useTokenAllowance({
    currency: swap?.currencyDeposit,
    spenderAddress: swap?.addressDeposit,
  });

  const explorerLink = useMemo(() => {
    if (!swap || !swap.txReceivingId) return undefined;
    return buildExplorerLink({
      context,
      coin: swap.currencyReceiving,
      transactionId: swap.txReceivingId,
    });
  }, [context, swap]);

  const doTransfer = useCallback(async () => {
    try {
      const result = await transfer({ swap });
      setTransactionSucceded(result.status);
    } catch (e) {
      logger.error(e);
    }
  }, [transfer, swap]);

  const doApprove = useCallback(async () => {
    if (!swap) return;

    try {
      await approveTokenAllowance({
        currency: swap.currencyDeposit,
        spenderAddress: swap.addressDeposit,
        amount: swap.amountDeposit,
      });
      recheckAllowance();
    } catch (e) {
      logger.error(e);
    }
  }, [swap, approveTokenAllowance, recheckAllowance]);

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

  return (
    <VerticalWidgetView
      onClickBack={() => push(`/${context.mode}/${resource}/new`)}
      top={<Top swap={swap} data-testid={buildTestId('')} />}
      data-testid={buildTestId('')}
    >
      {layout === 'website' && <NodeSelector swap={swap} />}
      {layout === 'website' &&
        swap.status === 'WAITING' &&
        getChainFor({ coin: swap.currencyDeposit }) === 'ethereum' && <ConnectWallet />}

      {address && swap.status === 'WAITING' && (isTransferring || hasTransactionSucceeded) && (
        <Loading />
      )}
      {address && swap.status === 'WAITING' && !isTransferring && !hasTransactionSucceeded && (
        <>
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
          <Space size="house" />
        </>
      )}
      {!address && swap.status === 'WAITING' && !isTransferring && !hasTransactionSucceeded && (
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
