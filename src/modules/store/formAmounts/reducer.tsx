import { Coin } from '@swingby-protocol/sdk';
import { Reducer } from 'redux';

enum Actions {
  Set = 'FromAmounts/SET',
  Clear = 'FromAmounts/CLEAR',
}

const initialState = {
  currencyFrom: 'BTC' as Coin,
  currencyTo: 'BTC.B' as Coin,
  amountFrom: '',
  amountTo: '',
};

type State = typeof initialState;

export const formAmounts: Reducer<State, Action> = (state = initialState, action) => {
  if (action.type === Actions.Clear) {
    return initialState;
  }

  if (action.type === Actions.Set) {
    return { ...state, ...action.data };
  }

  return state;
};

export const actionClearFormAmounts = () => ({ type: Actions.Clear } as const);
export const actionSetFormAmounts = (data: Partial<State>) =>
  ({ type: Actions.Set, data } as const);

type Action = ReturnType<typeof actionSetFormAmounts> | ReturnType<typeof actionClearFormAmounts>;
