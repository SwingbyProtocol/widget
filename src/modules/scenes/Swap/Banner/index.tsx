import {
  Button,
  CoinIcon,
  formatCryptoAsset,
  Icon,
  useMatchMedia,
  CopyToClipboard,
} from '@swingby-protocol/pulsar';
import { useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { CoinAmount } from '../../../../components/CoinAmount';
import { actionSetFormAddress, useIsReceivingAddressValid } from '../../../store/formAddress';
import { useAreFormAmountsValid } from '../../../store/formAmounts';
import { StylingConstants } from '../../../styles';

import { BannerContainer, Space, AddressInput, SendTo, SendToLabel, SendToValue } from './styled';

export const Banner = () => {
  const { formatMessage, locale } = useIntl();
  const hasWideWidth = useMatchMedia({ query: StylingConstants.mediaWideWidth });
  const { currencyFrom, currencyTo } = useSelector((state) => state.formAmounts);
  const { receivingAddress } = useSelector((state) => state.formAddress);
  const { isReceivingAddressValid } = useIsReceivingAddressValid();
  const { isFormDataValid } = useAreFormAmountsValid();
  const dispatch = useDispatch();
  const [step, setStep] = useState<'amounts' | 'address' | 'send-to'>(
    isFormDataValid && isReceivingAddressValid ? 'address' : 'amounts',
  );

  return (
    <BannerContainer>
      {step === 'send-to' ? (
        <>
          <Button
            variant="secondary"
            size="street"
            shape="circle"
            onClick={() => setStep('address')}
          >
            <Icon.CaretLeft />
          </Button>
          <Space />
          <SendTo>
            <SendToLabel>
              <FormattedMessage
                id="widget.send-to"
                values={{
                  amount: formatCryptoAsset({
                    locale,
                    amount: 0.999967,
                    displaySymbol: currencyFrom,
                  }),
                }}
              />
            </SendToLabel>
            <SendToValue>
              {formatCryptoAsset({
                locale,
                amount: 0.999967,
                displaySymbol: currencyFrom,
              })}
            </SendToValue>
          </SendTo>
          <Space />
          <CopyToClipboard
            size="state"
            left={hasWideWidth ? <CoinIcon symbol={currencyTo} /> : undefined}
            value="mzoPuK5PnAGNT19dF22L5Wng8D5T1jSBEG"
          />
          <Space />
          <Button
            variant="tertiary"
            size={hasWideWidth ? 'state' : 'town'}
            shape={hasWideWidth ? 'fit' : 'square'}
            disabled={!isFormDataValid}
          >
            {hasWideWidth ? formatMessage({ id: 'widget.explorer-btn' }) : <Icon.ExternalLink />}
          </Button>
        </>
      ) : step === 'address' ? (
        <>
          <Button
            variant="secondary"
            size="street"
            shape="circle"
            onClick={() => setStep('amounts')}
          >
            <Icon.CaretLeft />
          </Button>
          <Space />
          <AddressInput
            size="state"
            left={<CoinIcon symbol={currencyFrom} />}
            value={receivingAddress}
            onChange={(evt) =>
              dispatch(actionSetFormAddress({ receivingAddress: evt.target.value }))
            }
            placeholder={formatMessage({ id: 'widget.receiving-address.placeholder' })}
          />
          <Space />
          <Button
            variant="primary"
            size="state"
            shape="fit"
            disabled={!isFormDataValid}
            onClick={() => setStep('send-to')}
          >
            {hasWideWidth ? formatMessage({ id: 'widget.swap-btn' }) : <Icon.CaretRight />}
          </Button>
        </>
      ) : (
        <>
          <CoinAmount variant="banner" />
          <Space />
          <Button
            variant="primary"
            size="state"
            shape="fit"
            disabled={!isFormDataValid}
            onClick={() => setStep('address')}
          >
            {hasWideWidth ? formatMessage({ id: 'widget.swap-btn' }) : <Icon.CaretRight />}
          </Button>
        </>
      )}
    </BannerContainer>
  );
};
