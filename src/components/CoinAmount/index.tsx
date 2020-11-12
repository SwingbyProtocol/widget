import { TextInput } from '@swingby-protocol/pulsar';
import { Coin, SUPPORTED_COINS } from '@swingby-protocol/sdk';
import { FormattedMessage } from 'react-intl';
import { BigNumber } from 'bignumber.js';

import { CoinAmountContainer, Label, SwapVertical, SwapHorizontal, Variant } from './styled';
import { CurrencySelector } from './CurrencySelector';

type State = { currencyFrom: Coin; currencyTo: Coin; amountFrom: string; amountTo: string };
const emptyState: State = {
  currencyFrom: 'BTC',
  amountFrom: '',
  currencyTo: 'BTC.B',
  amountTo: '',
};

type Props = { variant: Variant; state: State; onChange: (state: State) => void };

export const CoinAmount = ({ variant, state, onChange }: Props) => (
  <CoinAmountContainer variant={variant}>
    {variant === 'vertical' && (
      <Label>
        <FormattedMessage id="widget.from" />
      </Label>
    )}
    <CurrencySelector
      variant={variant}
      value={state.currencyFrom}
      onChange={(currencyFrom) => onChange({ ...state, currencyFrom })}
    />
    <TextInput
      size="state"
      value={state.amountFrom}
      onChange={(evt) => onChange({ ...state, amountFrom: evt.target.value })}
    />
    {variant === 'vertical' && <Label />}
    {variant === 'banner' ? <SwapHorizontal /> : <SwapVertical />}
    {variant === 'vertical' && (
      <Label>
        <FormattedMessage id="widget.to" />
      </Label>
    )}
    <CurrencySelector
      variant={variant}
      value={state.currencyTo}
      onChange={(currencyTo) => onChange({ ...state, currencyTo })}
    />
    <TextInput
      size="state"
      value={state.amountTo}
      onChange={(evt) => onChange({ ...state, amountTo: evt.target.value })}
    />
  </CoinAmountContainer>
);

CoinAmount.emptyState = emptyState;

CoinAmount.isValid = (state: State) => {
  if (
    !SUPPORTED_COINS.includes(state.currencyFrom) ||
    !SUPPORTED_COINS.includes(state.currencyTo)
  ) {
    return false;
  }

  if (state.currencyFrom === state.currencyTo) {
    return false;
  }

  if (new BigNumber(state.amountFrom).isNaN() || new BigNumber(state.amountTo).isNaN()) {
    return false;
  }

  return true;
};
