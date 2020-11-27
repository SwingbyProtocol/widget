import { Coin } from '@swingby-protocol/sdk';
import { Reducer } from 'redux';

enum Actions {
  Set = 'Swap/SET',
  Clear = 'Swap/CLEAR',
}

const initialState = {
  currencyIn: 'BTC' as Coin,
  currencyOut: 'BTCE' as Coin,
  amountUser: '',
  addressOut: '',
};

type State = typeof initialState;

export const swap: Reducer<State, Action> = (state = initialState, action) => {
  if (action.type === Actions.Clear) {
    return initialState;
  }

  if (action.type === Actions.Set) {
    return { ...state, ...action.data };
  }

  return state;
};

export const actionClearSwapData = () => ({ type: Actions.Clear } as const);
export const actionSetSwapData = (data: Partial<State>) => ({ type: Actions.Set, data } as const);

type Action = ReturnType<typeof actionSetSwapData> | ReturnType<typeof actionClearSwapData>;
