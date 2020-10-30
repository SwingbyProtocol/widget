import { useState } from 'react';

import { useWidgetLayout } from '../../modules/swap/useWidgetLayout';

import {
  CoinAmountContainer,
  Label,
  StyledTextInput,
  SwapVertical,
  SwapHorizontal,
} from './styled';

type Props = { label?: React.ReactNode };

export const CoinAmount = ({ label }: Props) => {
  const layout = useWidgetLayout();
  const [fromToken, setFromToken] = useState('');
  const [fromAmount, setFromAmount] = useState('');

  return (
    <CoinAmountContainer>
      <Label>From</Label>
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
      {layout === 'vertical' && <SwapVertical />}
      {layout === 'horizontal' && <SwapHorizontal />}
      <Label>To</Label>
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
