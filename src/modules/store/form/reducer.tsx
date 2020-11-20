import { Coin } from '@swingby-protocol/sdk';
import { Reducer } from 'redux';

enum Actions {
  Set = 'Form/SET',
  Clear = 'Form/CLEAR',
}

const initialState = {
  currencyIn: 'BTC' as Coin,
  currencyOut: 'BTC.B' as Coin,
  amountUser: '',
  addressOut: '',
};

type State = typeof initialState;

export const form: Reducer<State, Action> = (state = initialState, action) => {
  if (action.type === Actions.Clear) {
    return initialState;
  }

  if (action.type === Actions.Set) {
    return { ...state, ...action.data };
  }

  return state;
};

export const actionClearFormData = () => ({ type: Actions.Clear } as const);
export const actionSetFormData = (data: Partial<State>) => ({ type: Actions.Set, data } as const);

type Action = ReturnType<typeof actionSetFormData> | ReturnType<typeof actionClearFormData>;
