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
import { buildExplorerLink } from '@swingby-protocol/sdk';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { BackButton } from '../../../components/BackButton';
import { useSdkContext } from '../../../modules/sdk-context';
import { StylingConstants } from '../../../modules/styles';
import { useSwapDetails } from '../../useSwapDetails';

import { BannerContainer, ResponsiveSpace, SendTo, SendToLabel, SendToValue } from './styled';

export const Banner = () => {
  const { buildTestId } = useBuildTestId({ id: 'banner.swap-details' });
  const { formatMessage, locale } = useIntl();
  const hasWideWidth = useMatchMedia({ query: StylingConstants.mediaWideWidth });
  const { swap } = useSwapDetails();
  const { push } = useRouter();
  const context = useSdkContext();

  const explorerLink = useMemo(() => {
    if (!swap || !swap.transactionOutId) return undefined;
    return buildExplorerLink({
      context,
      currency: swap.currencyOut,
      transactionId: swap.transactionOutId,
    });
  }, [context, swap]);

  if (!swap) {
    return <Loading data-testid={buildTestId('loading')} />;
  }

  return (
    <BannerContainer>
      <BackButton onClick={() => push('/swap/new')} data-testid={buildTestId('back-btn')} />
      <ResponsiveSpace />

      {swap.status === 'waiting' && (
        <SendTo data-testid={buildTestId('send-label')}>
          <SendToLabel>
            <FormattedMessage id="widget.send-to" />
          </SendToLabel>
          <SendToValue>
            {getCryptoAssetFormatter({
              locale,
              displaySymbol: swap.currencyIn,
            }).format(+swap.amountIn)}
          </SendToValue>
        </SendTo>
      )}

      {(swap.status === 'signing' || swap.status === 'sending') && (
        <SendTo data-testid={buildTestId('sending-label')}>
          <SendToLabel>
            <FormattedMessage id="widget.sending-to" />
          </SendToLabel>
          <SendToValue>
            {getCryptoAssetFormatter({
              locale,
              displaySymbol: swap.currencyOut,
            }).format(+(swap.amountOut ?? 0))}
          </SendToValue>
        </SendTo>
      )}

      {swap.status === 'completed' && (
        <SendTo data-testid={buildTestId('completed-label')}>
          <SendToLabel>
            <FormattedMessage id="widget.sent-to" />
          </SendToLabel>
          <SendToValue>
            {getCryptoAssetFormatter({
              locale,
              displaySymbol: swap.currencyOut,
            }).format(+(swap.amountOut ?? 0))}
          </SendToValue>
        </SendTo>
      )}

      <ResponsiveSpace />
      <CopyToClipboard
        size="state"
        left={
          hasWideWidth ? (
            <CoinIcon symbol={swap.status === 'waiting' ? swap.currencyIn : swap.currencyOut} />
          ) : undefined
        }
        value={swap.status === 'waiting' ? swap.addressSwapIn : swap.addressUserIn}
        data-testid={buildTestId(`address`)}
      />
      <ResponsiveSpace />
      {explorerLink && (
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
      )}
    </BannerContainer>
  );
};
