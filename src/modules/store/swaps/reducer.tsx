import type { SkybridgeCoin, SkybridgeStatus } from '@swingby-protocol/sdk';
import { Reducer } from 'redux';

enum Actions {
  Set = 'Swaps/SET',
  Clear = 'Swaps/CLEAR',
}

type SwapData = {
  hash: string;
  addressUserIn: string;
  addressSwapIn: string;
  addressUserOut?: string | null;
  amountIn: string;
  amountOut?: string | null;
  currencyIn: SkybridgeCoin;
  currencyOut: SkybridgeCoin;
  timestamp: Date;
  feeCurrency?: SkybridgeCoin;
  feeTotal?: string;
  status: SkybridgeStatus;
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
    return {
      ...state,
      [action.data.hash]: {
        ...state[action.data.hash],
        ...action.data,
        addressSwapIn: (action.data.addressSwapIn ?? state[action.data.hash]?.addressSwapIn) || '',
      },
    };
  }

  return state;
};

export const actionClearAllSwaps = () => ({ type: Actions.Clear } as const);

export const actionSetSwap = (
  data: Omit<SwapData, 'addressSwapIn'> & Partial<Pick<SwapData, 'addressSwapIn'>>,
) => ({ type: Actions.Set, data } as const);

type Action = ReturnType<typeof actionSetSwap> | ReturnType<typeof actionClearAllSwaps>;
