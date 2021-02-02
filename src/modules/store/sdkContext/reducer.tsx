import { SkybridgeContext } from '@swingby-protocol/sdk';
import { Reducer } from 'redux';

enum Actions {
  Set = 'SwapForm/SET',
}

type State = SkybridgeContext;

export const sdkContext: Reducer<State, Action> = (state = null as any, action) => {
  if (action.type === Actions.Set) {
    return { ...state, ...action.data };
  }

  return state;
};

export const actionSetSdkContext = (data: SkybridgeContext) =>
  ({ type: Actions.Set, data } as const);

type Action = ReturnType<typeof actionSetSdkContext>;
