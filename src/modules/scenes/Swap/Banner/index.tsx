import {
  Button,
  CoinIcon,
  Icon,
  useMatchMedia,
  CopyToClipboard,
  getCryptoAssetFormatter,
  useBuildTestId,
} from '@swingby-protocol/pulsar';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { BackButton } from '../../../../components/BackButton';
import { CoinAmount } from '../../../../components/CoinAmount';
import {
  actionSetFormData,
  useAreFormAmountsValid,
  useIsReceivingAddressValid,
} from '../../../store/form';
import { StylingConstants } from '../../../styles';

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
  const { currencyFrom, currencyTo, receivingAddress } = useSelector((state) => state.form);
  const { isReceivingAddressValid } = useIsReceivingAddressValid();
  const { areFormAmountsValid } = useAreFormAmountsValid();
  const dispatch = useDispatch();
  const [step, setStep] = useState<'amounts' | 'address' | 'send-to'>(
    areFormAmountsValid && isReceivingAddressValid ? 'address' : 'amounts',
  );

  return (
    <BannerContainer>
      {step === 'send-to' ? (
        <>
          <BackButton
            onClick={() => setStep('address')}
            data-testid={buildTestId('step-send-to.back-btn')}
          />
          <ResponsiveSpace />
          <SendTo data-testid={buildTestId('step-send-to.send-label')}>
            <SendToLabel>
              <FormattedMessage
                id="widget.send-to"
                values={{
                  amount: getCryptoAssetFormatter({
                    locale,
                    displaySymbol: currencyFrom,
                  }).format(0.999967),
                }}
              />
            </SendToLabel>
            <SendToValue>
              {getCryptoAssetFormatter({
                locale,
                displaySymbol: currencyFrom,
              }).format(0.999967)}
            </SendToValue>
          </SendTo>
          <ResponsiveSpace />
          <CopyToClipboard
            size="state"
            left={hasWideWidth ? <CoinIcon symbol={currencyFrom} /> : undefined}
            value="mzoPuK5PnAGNT19dF22L5Wng8D5T1jSBEG"
            data-testid={buildTestId('step-send-to.address')}
          />
          <ResponsiveSpace />
          <Button
            variant="tertiary"
            size={hasWideWidth ? 'state' : 'town'}
            shape={hasWideWidth ? 'fit' : 'square'}
            disabled={!areFormAmountsValid}
            data-testid={buildTestId('step-send-to.explorer-btn')}
          >
            {hasWideWidth ? formatMessage({ id: 'widget.explorer-btn' }) : <Icon.ExternalLink />}
          </Button>
        </>
      ) : step === 'address' ? (
        <>
          <BackButton
            onClick={() => setStep('amounts')}
            data-testid={buildTestId('step-address.back-btn')}
          />
          <ResponsiveSpace />
          <AddressInput
            size="state"
            left={<CoinIcon symbol={currencyTo} />}
            value={receivingAddress}
            onChange={(evt) => dispatch(actionSetFormData({ receivingAddress: evt.target.value }))}
            placeholder={formatMessage({ id: 'widget.receiving-address.placeholder' })}
            data-testid={buildTestId('step-address.receiving-address')}
          />
          <ResponsiveSpace />
          <Button
            variant="primary"
            size="state"
            shape="fit"
            disabled={!areFormAmountsValid}
            onClick={() => setStep('send-to')}
            data-testid={buildTestId('step-address.swap-btn')}
          >
            {hasWideWidth ? formatMessage({ id: 'widget.swap-btn' }) : <Icon.CaretRight />}
          </Button>
        </>
      ) : (
        <>
          <CoinAmount variant="banner" data-testid={buildTestId('step-amounts.amounts')} />
          <ResponsiveSpace />
          <Button
            variant="primary"
            size="state"
            shape="fit"
            disabled={!areFormAmountsValid}
            onClick={() => setStep('address')}
            data-testid={buildTestId('step-address.next-btn')}
          >
            {hasWideWidth ? formatMessage({ id: 'widget.swap-btn' }) : <Icon.CaretRight />}
          </Button>
        </>
      )}
    </BannerContainer>
  );
};
