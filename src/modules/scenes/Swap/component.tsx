import { useEffect, useState } from 'react';
import { Button, TextInput } from '@swingby-protocol/pulsar';
import { useIntl } from 'react-intl';
import { calculateSwap, isSupportedCoin } from '@swingby-protocol/sdk';

import { CoinAmount } from '../../../components/CoinAmount';
import { logger } from '../../logger';

import { SwapContainer } from './styled';

export const Swap = () => {
  const { formatMessage } = useIntl();
  const [address, setAddress] = useState('');
  const [coinAmountState, setCoinAmountState] = useState(CoinAmount.emptyState);
  const { currencyTo, amountTo, amountFrom, currencyFrom } = coinAmountState;

  useEffect(() => {
    (async () => {
      if (!isSupportedCoin(currencyFrom)) {
        logger.debug(`"${currencyFrom}" not supported. Won't do anything.`);
        return;
      }

      if (!isSupportedCoin(currencyTo)) {
        logger.debug(`"${currencyTo}" not supported. Won't do anything.`);
        return;
      }

      const result = await calculateSwap({
        amount: amountFrom,
        currencyFrom,
        currencyTo,
        addressTo: address,
      });

      logger.debug(result, 'prepareSwap()');
    })();
  }, [amountFrom, amountTo, currencyFrom, currencyTo, address]);

  return (
    <SwapContainer>
      <CoinAmount state={coinAmountState} onChange={setCoinAmountState} />
      <TextInput
        size="state"
        value={address}
        onChange={(evt) => setAddress(evt.target.value)}
        label={formatMessage({ id: 'widget.receiving-address.label' })}
        placeholder={formatMessage({ id: 'widget.receiving-address.placeholder' })}
      />
      <Button variant="primary" size="country">
        {formatMessage({ id: 'widget.swap-btn' })}
      </Button>
    </SwapContainer>
  );
};
