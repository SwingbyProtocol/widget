import { Button, Loading, SwapProgress, useBuildTestId } from '@swingby-protocol/pulsar';
import { buildExplorerLink, SkybridgeResource } from '@swingby-protocol/sdk';
import { useCallback, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Space } from '../../../components/Space';
import { VerticalWidgetView } from '../../../components/VerticalWidgetView';
import { logger } from '../../../modules/logger';
import { usePushWithSearchParams } from '../../../modules/push-keeping-search';
import { getTransferUriFor } from '../../../modules/send-funds-uri';
import { useSdkContext } from '../../../modules/store/sdkContext';
import { useAssertTermsSignature } from '../../../modules/terms';
import { isWeb3ableCurrency, useOnboard, useTransferToken } from '../../../modules/web3';
import { SwapData } from '../../../modules/store/swaps';
import { explorerSwapDetailUrl } from '../../../modules/env';

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

type VerticalProps = {
  resource: SkybridgeResource;
  swap?: SwapData | null;
};

export const Vertical = ({ resource, swap }: VerticalProps) => {
  const { buildTestId } = useBuildTestId({ id: 'vertical.swap-details' });
  const { push } = usePushWithSearchParams();
  const { locale } = useIntl();
  const context = useSdkContext();
  const { address } = useOnboard();
  const { transfer, loading: isTransferring } = useTransferToken();
  const [hasTransactionSucceeded, setTransactionSucceeded] = useState(false);
  const { assertTermsSignature } = useAssertTermsSignature();

  const goToExplorerUrl = explorerSwapDetailUrl.replace('{swapId}', swap?.hash || '');

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

  const explorerLink = ({ url }: { url: string }) => (
    <div>
      <ExplorerLink href={url} target="_blank" data-testid={buildTestId('explorer-link')}>
        <RowLink>
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
      swap={swap}
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
      {(swap.txDepositId || swap.txReceivingId) && (
        <>
          <Space size="town" shape="fill" />
          <ExplorerContainer>{explorerLink({ url: goToExplorerUrl })}</ExplorerContainer>
        </>
      )}
    </VerticalWidgetView>
  );
};
