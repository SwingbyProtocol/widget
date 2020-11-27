import { Coin } from '@swingby-protocol/sdk';
import { Reducer } from 'redux';

enum Actions {
  Set = 'SwapForm/SET',
  SetStep = 'SwapForm/SET_STEP',
  Clear = 'SwapForm/CLEAR',
}

const initialState = {
  step: 'step-amounts' as 'step-amounts' | 'step-address',
  currencyIn: 'BTC' as Coin,
  currencyOut: 'BTCE' as Coin,
  amountUser: '',
  addressUserIn: '',
};

type State = typeof initialState;

export const swapForm: Reducer<State, Action> = (state = initialState, action) => {
  if (action.type === Actions.Clear) {
    return initialState;
  }

  if (action.type === Actions.Set) {
    return { ...state, ...action.data };
  }

  if (action.type === Actions.SetStep) {
    return { ...state, step: action.data };
  }

  return state;
};

export const actionClearSwapFormData = () => ({ type: Actions.Clear } as const);

export const actionSetSwapFormData = (data: Partial<Omit<State, 'step'>>) =>
  ({ type: Actions.Set, data } as const);

export const actionSetSwapFormStep = (data: State['step']) =>
  ({ type: Actions.SetStep, data } as const);

type Action =
  | ReturnType<typeof actionSetSwapFormData>
  | ReturnType<typeof actionClearSwapFormData>
  | ReturnType<typeof actionSetSwapFormStep>;
