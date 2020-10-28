import { useState } from 'react';
import { Button, TextInput } from '@swingby-protocol/pulsar';

export const Swap = () => {
  const [fromToken, setFromToken] = useState('');
  const [fromAmount, setFromAmount] = useState('');
  const [toToken, setToToken] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [address, setAddress] = useState('');
  return (
    <div>
      <div>
        From:
        <TextInput
          size="state"
          value={fromToken}
          onChange={(evt) => setFromToken(evt.target.value)}
        />
        <TextInput
          size="state"
          value={fromAmount}
          onChange={(evt) => setFromAmount(evt.target.value)}
        />
      </div>
      <div>
        To:
        <TextInput size="state" value={toToken} onChange={(evt) => setToToken(evt.target.value)} />
        <TextInput
          size="state"
          value={toAmount}
          onChange={(evt) => setToAmount(evt.target.value)}
        />
      </div>
      <TextInput
        size="state"
        label="Receiving Address"
        value={address}
        onChange={(evt) => setAddress(evt.target.value)}
      />
      <Button variant="primary" size="country">
        Swap
      </Button>
    </div>
  );
};
