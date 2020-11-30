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
import { useRouter } from 'next/router';
import { FormattedMessage, useIntl } from 'react-intl';

import { BackButton } from '../../../components/BackButton';
import { StylingConstants } from '../../../modules/styles';
import { useSwapDetails } from '../../useSwapDetails';

import { BannerContainer, ResponsiveSpace, SendTo, SendToLabel, SendToValue } from './styled';

export const Banner = () => {
  const { buildTestId } = useBuildTestId({ id: 'banner.swap-details' });
  const { formatMessage, locale } = useIntl();
  const hasWideWidth = useMatchMedia({ query: StylingConstants.mediaWideWidth });
  const { swap } = useSwapDetails();
  const { push } = useRouter();

  if (!swap) {
    return <Loading data-testid={buildTestId('loading')} />;
  }

  return (
    <BannerContainer>
      <BackButton onClick={() => push('/swap/new')} data-testid={buildTestId('back-btn')} />
      <ResponsiveSpace />
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
      <ResponsiveSpace />
      <CopyToClipboard
        size="state"
        left={hasWideWidth ? <CoinIcon symbol={swap.currencyIn} /> : undefined}
        value={swap.addressSwapIn}
        data-testid={buildTestId(`address`)}
      />
      <ResponsiveSpace />
      <Button
        variant="tertiary"
        size={hasWideWidth ? 'state' : 'town'}
        shape={hasWideWidth ? 'fit' : 'square'}
        data-testid={buildTestId('explorer-btn')}
      >
        {hasWideWidth ? formatMessage({ id: 'widget.explorer-btn' }) : <Icon.ExternalLink />}
      </Button>
    </BannerContainer>
  );
};
