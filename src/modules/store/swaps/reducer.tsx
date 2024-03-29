import type { SkybridgeCoin, SkybridgeStatus } from '@swingby-protocol/sdk';
import { Reducer } from 'redux';

enum Actions {
  Set = 'Swaps/SET',
  Clear = 'Swaps/CLEAR',
}

export type SwapData = {
  hash: string;
  addressReceiving: string;
  addressDeposit: string;
  amountDeposit: string;
  amountReceiving?: string | null;
  currencyDeposit: SkybridgeCoin;
  currencyReceiving: SkybridgeCoin;
  timestamp: Date;
  feeCurrency?: SkybridgeCoin;
  feeTotal?: string;
  status: SkybridgeStatus;
  txDepositId?: string | null;
  txReceivingId?: string | null;
  isSkypoolsSwap: boolean;
  rebalanceRewards?: string | null;
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
        addressDeposit:
          (action.data.addressDeposit ?? state[action.data.hash]?.addressDeposit) || '',
      },
    };
  }

  return state;
};

export const actionClearAllSwaps = () => ({ type: Actions.Clear } as const);

export const actionSetSwap = (
  data: Omit<SwapData, 'addressDeposit'> & Partial<Pick<SwapData, 'addressDeposit'>>,
) => ({ type: Actions.Set, data } as const);

type Action = ReturnType<typeof actionSetSwap> | ReturnType<typeof actionClearAllSwaps>;
