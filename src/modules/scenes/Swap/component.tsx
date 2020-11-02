import { useEffect, useState } from 'react';
import { Button, TextInput } from '@swingby-protocol/pulsar';
import { useIntl } from 'react-intl';

import { CoinAmount } from '../../../components/CoinAmount';
import { prepareSwap } from '../../swap/prepareSwap';
import { logger } from '../../logger';

import { SwapContainer } from './styled';

export const Swap = () => {
  const { formatMessage } = useIntl();
  const [coinAmountState, setCoinAmountState] = useState(CoinAmount.emptyState);
  const [address, setAddress] = useState('');

  useEffect(() => {
    (async () => {
      const result = await prepareSwap({
        amount: coinAmountState.fromAmount,
        currencyFrom: coinAmountState.fromToken,
        destAddr: address,
      });
      logger.debug(result, 'prepareSwap()');
    })();
  }, [coinAmountState, address]);

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
