import { Dropdown, TextInput } from '@swingby-protocol/pulsar';
import { SUPPORTED_COINS } from '@swingby-protocol/sdk';
import { FormattedMessage } from 'react-intl';

import { useWidgetLayout } from '../../modules/layout';

import { CoinAmountContainer, Label, SwapVertical, SwapHorizontal } from './styled';

type State = { currencyFrom: string; currencyTo: string; amountFrom: string; amountTo: string };
const emptyState: State = {
  currencyFrom: 'BTC',
  amountFrom: '',
  currencyTo: 'BTC.B',
  amountTo: '',
};

type Props = { state: State; onChange: (state: State) => void };

export const CoinAmount = ({ state, onChange }: Props) => {
  const layout = useWidgetLayout();
  return (
    <CoinAmountContainer>
      <Label>
        <FormattedMessage id="widget.from" />
      </Label>
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
      {layout === 'small' ? <SwapHorizontal /> : <SwapVertical />}
      <Label>
        <FormattedMessage id="widget.to" />
      </Label>
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
};

CoinAmount.emptyState = emptyState;
