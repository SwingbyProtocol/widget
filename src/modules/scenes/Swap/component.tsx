import { useState } from 'react';
import { Button, TextInput } from '@swingby-protocol/pulsar';
import { useIntl } from 'react-intl';

import { CoinAmount } from '../../../components/CoinAmount';

import { SwapContainer } from './styled';

export const Swap = () => {
  const { formatMessage } = useIntl();
  const [address, setAddress] = useState('');
  return (
    <SwapContainer>
      <CoinAmount label="From" />
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
