import { FormattedMessage } from 'react-intl';

import { useWidgetLayout } from '../../modules/layout';

import {
  CoinAmountContainer,
  Label,
  StyledTextInput,
  SwapVertical,
  SwapHorizontal,
} from './styled';

type State = { currencyFrom: string; currencyTo: string; amountFrom: string; amountTo: string };
const emptyState: State = { currencyFrom: '', amountFrom: '', currencyTo: '', amountTo: '' };

type Props = { state: State; onChange: (state: State) => void };

export const CoinAmount = ({ state, onChange }: Props) => {
  const layout = useWidgetLayout();
  return (
    <CoinAmountContainer>
      <Label>
        <FormattedMessage id="widget.from" />
      </Label>
      <StyledTextInput
        size="state"
        value={state.currencyFrom}
        onChange={(evt) => onChange({ ...state, currencyFrom: evt.target.value })}
      />
      <StyledTextInput
        size="state"
        value={state.amountFrom}
        onChange={(evt) => onChange({ ...state, amountFrom: evt.target.value })}
      />
      {layout === 'small' ? <SwapHorizontal /> : <SwapVertical />}
      <Label>
        <FormattedMessage id="widget.to" />
      </Label>
      <StyledTextInput
        size="state"
        value={state.currencyTo}
        onChange={(evt) => onChange({ ...state, currencyTo: evt.target.value })}
      />
      <StyledTextInput
        size="state"
        value={state.amountTo}
        onChange={(evt) => onChange({ ...state, amountTo: evt.target.value })}
      />
    </CoinAmountContainer>
  );
};

CoinAmount.emptyState = emptyState;
