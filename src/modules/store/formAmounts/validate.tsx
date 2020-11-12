import { SUPPORTED_COINS } from '@swingby-protocol/sdk';
import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';
import { DefaultRootState, useSelector } from 'react-redux';

export const areFormAmountsValid = (state: DefaultRootState['formAmounts']): boolean => {
  if (
    !SUPPORTED_COINS.includes(state.currencyFrom) ||
    !SUPPORTED_COINS.includes(state.currencyTo)
  ) {
    return false;
  }

  if (state.currencyFrom === state.currencyTo) {
    return false;
  }

  if (new BigNumber(state.amountFrom).isNaN() || new BigNumber(state.amountTo).isNaN()) {
    return false;
  }

  return true;
};

export const useAreFormAmountsValid = () => {
  const data = useSelector((state) => state.formAmounts);
  return useMemo(() => ({ isFormDataValid: areFormAmountsValid(data) }), [data]);
};
