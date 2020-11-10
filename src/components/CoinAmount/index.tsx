import { Dropdown, TextInput } from '@swingby-protocol/pulsar';
import { SUPPORTED_COINS } from '@swingby-protocol/sdk';
import { FormattedMessage } from 'react-intl';

import { CoinAmountContainer, Label, SwapVertical, SwapHorizontal, Variant } from './styled';

type State = { currencyFrom: string; currencyTo: string; amountFrom: string; amountTo: string };
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
    <Dropdown
      target={
        <Dropdown.DefaultTarget variant="input" size="state">
          {state.currencyFrom}
        </Dropdown.DefaultTarget>
      }
    >
      {SUPPORTED_COINS.map((coin) => (
        <Dropdown.Item key={coin} onClick={(evt) => onChange({ ...state, currencyFrom: coin })}>
          {coin}
        </Dropdown.Item>
      ))}
    </Dropdown>
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
    <Dropdown
      target={
        <Dropdown.DefaultTarget variant="input" size="state">
          {state.currencyTo}
        </Dropdown.DefaultTarget>
      }
    >
      {SUPPORTED_COINS.map((coin) => (
        <Dropdown.Item key={coin} onClick={(evt) => onChange({ ...state, currencyTo: coin })}>
          {coin}
        </Dropdown.Item>
      ))}
    </Dropdown>
    <TextInput
      size="state"
      value={state.amountTo}
      onChange={(evt) => onChange({ ...state, amountTo: evt.target.value })}
    />
  </CoinAmountContainer>
);

CoinAmount.emptyState = emptyState;
