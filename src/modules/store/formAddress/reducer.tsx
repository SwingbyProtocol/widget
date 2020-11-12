import { Reducer } from 'redux';

enum Actions {
  Set = 'FromAddress/SET',
  Clear = 'FromAddress/CLEAR',
}

const initialState = {
  receivingAddress: '',
};

type State = typeof initialState;

export const formAddress: Reducer<State, Action> = (state = initialState, action) => {
  if (action.type === Actions.Clear) {
    return initialState;
  }

  if (action.type === Actions.Set) {
    return { ...state, ...action.data };
  }

  return state;
};

export const actionClearFormAddress = () => ({ type: Actions.Clear } as const);
export const actionSetFormAddress = (data: Partial<State>) =>
  ({ type: Actions.Set, data } as const);

type Action = ReturnType<typeof actionSetFormAddress> | ReturnType<typeof actionClearFormAddress>;
