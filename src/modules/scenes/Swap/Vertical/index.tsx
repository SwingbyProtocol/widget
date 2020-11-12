import { useEffect } from 'react';
import { TextInput } from '@swingby-protocol/pulsar';
import { useIntl } from 'react-intl';
import { calculateSwap } from '@swingby-protocol/sdk';
import { useDispatch, useSelector } from 'react-redux';

import { CoinAmount } from '../../../../components/CoinAmount';
import { logger } from '../../../logger';
import { useAreFormAmountsValid } from '../../../store/formAmounts';
import { actionSetFormAddress } from '../../../store/formAddress';

import { StyledButton, SwapContainer } from './styled';

export const Vertical = () => {
  const { formatMessage } = useIntl();
  const { receivingAddress } = useSelector((state) => state.formAddress);
  const { currencyTo, amountTo, amountFrom, currencyFrom } = useSelector(
    (state) => state.formAmounts,
  );
  const { isFormDataValid } = useAreFormAmountsValid();
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      if (!isFormDataValid) {
        return;
      }

      const result = await calculateSwap({
        amount: amountFrom,
        currencyFrom,
        currencyTo,
        addressTo: receivingAddress,
      });

      logger.debug(result, 'prepareSwap()');
    })();
  }, [amountFrom, amountTo, currencyFrom, currencyTo, receivingAddress, isFormDataValid]);

  return (
    <SwapContainer>
      <CoinAmount variant="vertical" />
      <TextInput
        size="state"
        value={receivingAddress}
        onChange={(evt) => dispatch(actionSetFormAddress({ receivingAddress: evt.target.value }))}
        label={formatMessage({ id: 'widget.receiving-address.label' })}
        placeholder={formatMessage({ id: 'widget.receiving-address.placeholder' })}
      />
      <StyledButton variant="primary" size="state" disabled={!isFormDataValid}>
        {formatMessage({ id: 'widget.swap-btn' })}
      </StyledButton>
    </SwapContainer>
  );
};
