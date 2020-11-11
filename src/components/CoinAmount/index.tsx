import { TextInput } from '@swingby-protocol/pulsar';
import { Coin } from '@swingby-protocol/sdk';
import { FormattedMessage } from 'react-intl';

import { CoinAmountContainer, Label, SwapVertical, SwapHorizontal, Variant } from './styled';
import { TokenSelector } from './TokenSelector';

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
    <TokenSelector
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
    <TokenSelector
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
