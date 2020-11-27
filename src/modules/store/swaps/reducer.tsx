import type { Coin, SwapStatus } from '@swingby-protocol/sdk';
import { Reducer } from 'redux';

enum Actions {
  Set = 'Swaps/SET',
  Clear = 'Swaps/CLEAR',
}

type SwapData = {
  hash: string;
  addressIn: string;
  addressOut: string;
  amountIn: string;
  amountOut?: string;
  currencyIn: Coin;
  currencyOut: Coin;
  timestamp: Date;
  feeCurrency?: Coin;
  feeTotal?: string;
  status: SwapStatus;
  transactionInId?: string | null;
  transactionOutId?: string | null;
};

type State = { [k: string]: undefined | SwapData };
const initialState: State = {};

export const swaps: Reducer<State, Action> = (state = initialState, action) => {
  if (action.type === Actions.Clear) {
    return initialState;
  }

  if (action.type === Actions.Set) {
    return { ...state, [action.data.hash]: { ...state[action.data.hash], ...action.data } };
  }

  return state;
};

export const actionClearAllSwaps = () => ({ type: Actions.Clear } as const);

export const actionSetSwap = (data: SwapData) => ({ type: Actions.Set, data } as const);

type Action = ReturnType<typeof actionSetSwap> | ReturnType<typeof actionClearAllSwaps>;
