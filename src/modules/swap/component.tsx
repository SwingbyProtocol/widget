import { useState } from 'react';
import { Button, TextInput } from '@swingby-protocol/pulsar';

import { CoinAmount } from '../../components/CoinAmount';

import { SwapContainer, SwapVertical, SwapHorizontal } from './styled';
import { useWidgetLayout } from './useWidgetLayout';

export const Swap = () => {
  const layout = useWidgetLayout();
  const [address, setAddress] = useState('');
  return (
    <SwapContainer>
      <CoinAmount label="From" />
      {layout === 'vertical' && <SwapVertical />}
      {layout === 'horizontal' && <SwapHorizontal />}
      <CoinAmount label="To" />
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
