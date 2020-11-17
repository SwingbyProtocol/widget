import {
  Button,
  CoinIcon,
  Icon,
  useMatchMedia,
  CopyToClipboard,
  getCryptoAssetFormatter,
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
          <BackButton onClick={() => setStep('address')} />
          <ResponsiveSpace />
          <SendTo>
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
            left={hasWideWidth ? <CoinIcon symbol={currencyTo} /> : undefined}
            value="mzoPuK5PnAGNT19dF22L5Wng8D5T1jSBEG"
          />
          <ResponsiveSpace />
          <Button
            variant="tertiary"
            size={hasWideWidth ? 'state' : 'town'}
            shape={hasWideWidth ? 'fit' : 'square'}
            disabled={!areFormAmountsValid}
          >
            {hasWideWidth ? formatMessage({ id: 'widget.explorer-btn' }) : <Icon.ExternalLink />}
          </Button>
        </>
      ) : step === 'address' ? (
        <>
          <BackButton onClick={() => setStep('amounts')} />
          <ResponsiveSpace />
          <AddressInput
            size="state"
            left={<CoinIcon symbol={currencyFrom} />}
            value={receivingAddress}
            onChange={(evt) => dispatch(actionSetFormData({ receivingAddress: evt.target.value }))}
            placeholder={formatMessage({ id: 'widget.receiving-address.placeholder' })}
          />
          <ResponsiveSpace />
          <Button
            variant="primary"
            size="state"
            shape="fit"
            disabled={!areFormAmountsValid}
            onClick={() => setStep('send-to')}
          >
            {hasWideWidth ? formatMessage({ id: 'widget.swap-btn' }) : <Icon.CaretRight />}
          </Button>
        </>
      ) : (
        <>
          <CoinAmount variant="banner" />
          <ResponsiveSpace />
          <Button
            variant="primary"
            size="state"
            shape="fit"
            disabled={!areFormAmountsValid}
            onClick={() => setStep('address')}
          >
            {hasWideWidth ? formatMessage({ id: 'widget.swap-btn' }) : <Icon.CaretRight />}
          </Button>
        </>
      )}
    </BannerContainer>
  );
};
