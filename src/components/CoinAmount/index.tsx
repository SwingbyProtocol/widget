import { useState } from 'react';

import { CoinAmountContainer, Label, StyledTextInput } from './styled';

type Props = { label?: React.ReactNode };

export const CoinAmount = ({ label }: Props) => {
  const [fromToken, setFromToken] = useState('');
  const [fromAmount, setFromAmount] = useState('');

  return (
    <CoinAmountContainer>
      {label && <Label>{label}</Label>}
      <StyledTextInput
        size="state"
        value={fromToken}
        onChange={(evt) => setFromToken(evt.target.value)}
      />
      <StyledTextInput
        size="state"
        value={fromAmount}
        onChange={(evt) => setFromAmount(evt.target.value)}
      />
    </CoinAmountContainer>
  );
};
