import { useState } from 'react';
import { Button, TextInput } from '@swingby-protocol/pulsar';

import { CoinAmount } from '../../components/CoinAmount';

import { SwapContainer } from './styled';

export const Swap = () => {
  const [address, setAddress] = useState('');
  return (
    <SwapContainer>
      <CoinAmount label="From" />
      <TextInput
        size="state"
        label="Receiving Address"
        value={address}
        onChange={(evt) => setAddress(evt.target.value)}
      />
      <Button variant="primary" size="country">
        Swap
      </Button>
    </SwapContainer>
  );
};
