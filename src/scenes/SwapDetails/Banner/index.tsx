import {
  Button,
  CoinIcon,
  Icon,
  useMatchMedia,
  CopyToClipboard,
  getCryptoAssetFormatter,
  useBuildTestId,
  Loading,
} from '@swingby-protocol/pulsar';
import { buildExplorerLink, SkybridgeResource } from '@swingby-protocol/sdk';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { BackButton } from '../../../components/BackButton';
import { Space } from '../../../components/Space';
import { StylingConstants } from '../../../modules/styles';
import { usePushWithSearchParams } from '../../../modules/push-keeping-search';
import { useSdkContext } from '../../../modules/store/sdkContext';
import { SwapData } from '../../../modules/store/swaps';

import { BannerContainer, ResponsiveSpace, SendTo, SendToLabel, SendToValue } from './styled';

type BannerProps = {
  resource: SkybridgeResource;
  swap?: SwapData | null;
};

export const Banner = ({ resource, swap }: BannerProps) => {
  const { buildTestId } = useBuildTestId({ id: 'banner.swap-details' });
  const { formatMessage, locale } = useIntl();
  const hasWideWidth = useMatchMedia({ query: StylingConstants.mediaWideWidth });
  const { push } = usePushWithSearchParams();
  const context = useSdkContext();

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
    <BannerContainer>
      <BackButton
        onClick={() => push(`/${context.mode}/${resource}/new`)}
        data-testid={buildTestId('back-btn')}
      />
      <ResponsiveSpace />

      <SendTo data-testid={buildTestId('status-label')}>
        <SendToLabel>
          <FormattedMessage id={`widget.status-label-short.${swap.status}`} />
        </SendToLabel>
        {swap.status === 'PENDING' && (
          <>
            <SendToValue>
              <FormattedMessage id="widget.status-label-long.WAITING_CONFIRMATIONS" />
            </SendToValue>
          </>
        )}
        {swap.status !== 'EXPIRED' && swap.status !== 'PENDING' && (
          <>
            {' '}
            <SendToValue>
              {getCryptoAssetFormatter({
                locale,
                displaySymbol:
                  swap.status === 'WAITING' ? swap.currencyDeposit : swap.currencyReceiving,
              }).format(
                +(swap.status === 'WAITING' ? swap.amountDeposit : swap.amountReceiving ?? 0),
              )}
            </SendToValue>
          </>
        )}
      </SendTo>

      {swap.status !== 'EXPIRED' && swap.status !== 'PENDING' && (
        <>
          <ResponsiveSpace />
          <CopyToClipboard
            size="state"
            left={
              hasWideWidth ? (
                <CoinIcon
                  symbol={swap.status === 'WAITING' ? swap.currencyDeposit : swap.currencyReceiving}
                />
              ) : undefined
            }
            value={swap.status === 'WAITING' ? swap.addressDeposit : swap.addressReceiving}
            data-testid={buildTestId(`address`)}
          />
          <ResponsiveSpace />
          <Button
            variant="primary"
            size={hasWideWidth ? 'state' : 'town'}
            shape={hasWideWidth ? 'fit' : 'square'}
            href={`${typeof window !== 'undefined' && window.location.href}`}
            target="_blank"
          >
            <Icon.QR />
          </Button>
        </>
      )}

      {(swap.status === 'EXPIRED' || swap.status === 'PENDING') && (
        <Space size="box" shape="fill" />
      )}

      {explorerLink && (
        <>
          <ResponsiveSpace />
          <Button
            variant="tertiary"
            size={hasWideWidth ? 'state' : 'town'}
            shape={hasWideWidth ? 'fit' : 'square'}
            data-testid={buildTestId('explorer-link')}
            href={explorerLink}
            target="_blank"
          >
            {hasWideWidth ? formatMessage({ id: 'widget.explorer-btn' }) : <Icon.ExternalLink />}
          </Button>
        </>
      )}
    </BannerContainer>
  );
};
