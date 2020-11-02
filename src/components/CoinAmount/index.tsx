import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { useWidgetLayout } from '../../modules/layout';

import {
  CoinAmountContainer,
  Label,
  StyledTextInput,
  SwapVertical,
  SwapHorizontal,
} from './styled';

type State = { fromToken: string; toToken: string; fromAmount: string; toAmount: string };
const emptyState: State = { fromToken: '', fromAmount: '', toToken: '', toAmount: '' };

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
        value={state.fromToken}
        onChange={(evt) => onChange({ ...state, fromToken: evt.target.value })}
      />
      <StyledTextInput
        size="state"
        value={state.fromAmount}
        onChange={(evt) => onChange({ ...state, fromAmount: evt.target.value })}
      />
      {layout === 'vertical' && <SwapVertical />}
      {layout === 'horizontal' && <SwapHorizontal />}
      <Label>
        <FormattedMessage id="widget.to" />
      </Label>
      <StyledTextInput
        size="state"
        value={state.toToken}
        onChange={(evt) => onChange({ ...state, toToken: evt.target.value })}
      />
      <StyledTextInput
        size="state"
        value={state.toAmount}
        onChange={(evt) => onChange({ ...state, toAmount: evt.target.value })}
      />
    </CoinAmountContainer>
  );
};

CoinAmount.emptyState = emptyState;
