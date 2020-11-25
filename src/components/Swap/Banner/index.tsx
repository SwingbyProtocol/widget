import { useCallback } from 'react';
import {
  Button,
  CoinIcon,
  Icon,
  useMatchMedia,
  CopyToClipboard,
  getCryptoAssetFormatter,
  useBuildTestId,
} from '@swingby-protocol/pulsar';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { BackButton } from '../../BackButton';
import { CoinAmount } from '../../CoinAmount';
import {
  actionSetSwapData,
  useAreCurrenciesValid,
  useCreateSwap,
  useIsAddressOutValid,
} from '../../../modules/store/swap';
import { useSetStep } from '../../../modules/store/pagination';
import { StylingConstants } from '../../../modules/styles';
import { logger } from '../../../modules/logger';

import {
  BannerContainer,
  ResponsiveSpace,
  AddressInput,
  SendTo,
  SendToLabel,
  SendToValue,
} from './styled';

export const Banner = () => {
  const { buildTestId } = useBuildTestId({ id: 'banner' });
  const { formatMessage, locale } = useIntl();
  const hasWideWidth = useMatchMedia({ query: StylingConstants.mediaWideWidth });
  const { currencyIn, currencyOut, addressOut } = useSelector((state) => state.swap);
  const { areCurrenciesValid: areFormAmountsValid } = useAreCurrenciesValid();
  const dispatch = useDispatch();
  const step = useSelector((state) => state.pagination.step);
  const { setStep } = useSetStep();
  const { isAddressOutValid } = useIsAddressOutValid();
  const { loading, createSwap } = useCreateSwap();

  const clickSwap = useCallback(async () => {
    try {
      await createSwap();
      setStep('step-submitted');
    } catch (e) {
      logger.error('Failed to create swap', e);
    }
  }, [createSwap, setStep]);

  return (
    <BannerContainer>
      {step === 'step-submitted' ? (
        <>
          <BackButton
            onClick={() => setStep('step-address')}
            data-testid={buildTestId(`${step}.back-btn`)}
          />
          <ResponsiveSpace />
          <SendTo data-testid={buildTestId(`${step}.send-label`)}>
            <SendToLabel>
              <FormattedMessage
                id="widget.send-to"
                values={{
                  amount: getCryptoAssetFormatter({
                    locale,
                    displaySymbol: currencyIn,
                  }).format(0.999967),
                }}
              />
            </SendToLabel>
            <SendToValue>
              {getCryptoAssetFormatter({
                locale,
                displaySymbol: currencyIn,
              }).format(0.999967)}
            </SendToValue>
          </SendTo>
          <ResponsiveSpace />
          <CopyToClipboard
            size="state"
            left={hasWideWidth ? <CoinIcon symbol={currencyIn} /> : undefined}
            value="mzoPuK5PnAGNT19dF22L5Wng8D5T1jSBEG"
            data-testid={buildTestId(`${step}.address`)}
          />
          <ResponsiveSpace />
          <Button
            variant="tertiary"
            size={hasWideWidth ? 'state' : 'town'}
            shape={hasWideWidth ? 'fit' : 'square'}
            disabled={!areFormAmountsValid}
            data-testid={buildTestId(`${step}.explorer-btn`)}
          >
            {hasWideWidth ? formatMessage({ id: 'widget.explorer-btn' }) : <Icon.ExternalLink />}
          </Button>
        </>
      ) : step === 'step-address' ? (
        <>
          <BackButton
            onClick={() => setStep('step-amounts')}
            data-testid={buildTestId(`${step}.back-btn`)}
          />
          <ResponsiveSpace />
          <AddressInput
            size="state"
            left={<CoinIcon symbol={currencyOut} />}
            value={addressOut}
            onChange={(evt) => dispatch(actionSetSwapData({ addressOut: evt.target.value }))}
            placeholder={formatMessage({ id: 'widget.receiving-address.placeholder' })}
            data-testid={buildTestId(`${step}.receiving-address`)}
          />
          <ResponsiveSpace />
          <Button
            variant="primary"
            size="state"
            shape="fit"
            disabled={!areFormAmountsValid || !isAddressOutValid || loading}
            onClick={clickSwap}
            data-testid={buildTestId(`${step}.swap-btn`)}
          >
            {loading ? (
              '…'
            ) : hasWideWidth ? (
              formatMessage({ id: 'widget.swap-btn' })
            ) : (
              <Icon.CaretRight />
            )}
          </Button>
        </>
      ) : (
        <>
          <CoinAmount variant="banner" data-testid={buildTestId(`${step}.amounts`)} />
          <ResponsiveSpace />
          <Button
            variant="primary"
            size="state"
            shape="fit"
            disabled={!areFormAmountsValid}
            onClick={() => setStep('step-address')}
            data-testid={buildTestId(`${step}.next-btn`)}
          >
            {hasWideWidth ? formatMessage({ id: 'widget.swap-btn' }) : <Icon.CaretRight />}
          </Button>
        </>
      )}
    </BannerContainer>
  );
};
