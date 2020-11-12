import { Button, CoinIcon, Icon, useMatchMedia } from '@swingby-protocol/pulsar';
import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { CoinAmount } from '../../../../components/CoinAmount';
import { actionSetFormAddress, useIsReceivingAddressValid } from '../../../store/formAddress';
import { useAreFormAmountsValid } from '../../../store/formAmounts';
import { StylingConstants } from '../../../styles';

import { BannerContainer, Space, AddressInput } from './styled';

export const Banner = () => {
  const { formatMessage } = useIntl();
  const hasWideWidth = useMatchMedia({ query: StylingConstants.mediaWideWidth });
  const { currencyFrom } = useSelector((state) => state.formAmounts);
  const { receivingAddress } = useSelector((state) => state.formAddress);
  const { isReceivingAddressValid } = useIsReceivingAddressValid();
  const { isFormDataValid } = useAreFormAmountsValid();
  const dispatch = useDispatch();
  const [step, setStep] = useState(isFormDataValid && isReceivingAddressValid ? 2 : 1);

  return (
    <BannerContainer>
      {step === 2 ? (
        <>
          <Button variant="secondary" size="town" shape="circle" onClick={() => setStep(1)}>
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
            shape="square"
            disabled={!isFormDataValid}
            onClick={() => setStep(2)}
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
            shape="square"
            disabled={!isFormDataValid}
            onClick={() => setStep(2)}
          >
            {hasWideWidth ? formatMessage({ id: 'widget.swap-btn' }) : <Icon.CaretRight />}
          </Button>
        </>
      )}
    </BannerContainer>
  );
};
