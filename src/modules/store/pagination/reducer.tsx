import { Reducer } from 'redux';

enum Actions {
  Set = 'Pagination/SET',
  Clear = 'Pagination/CLEAR',
}

const initialState = {
  step: 'step-amounts' as 'step-amounts' | 'step-address' | 'step-submitted',
};

type State = typeof initialState;

export const pagination: Reducer<State, Action> = (state = initialState, action) => {
  if (action.type === Actions.Clear) {
    return initialState;
  }

  if (action.type === Actions.Set) {
    return { ...state, ...action.data };
  }

  return state;
};

export const actionClearPagination = () => ({ type: Actions.Clear } as const);
export const actionSetPagination = (data: Partial<State>) => ({ type: Actions.Set, data } as const);

type Action = ReturnType<typeof actionSetPagination> | ReturnType<typeof actionClearPagination>;
