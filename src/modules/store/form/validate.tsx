import { SUPPORTED_COINS } from '@swingby-protocol/sdk';
import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';
import { DefaultRootState, useSelector } from 'react-redux';

const areFormAmountsValid = (
  state: Omit<DefaultRootState['form'], 'receivingAddress'>,
): boolean => {
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
  const data = useSelector((state) => state.form);
  return useMemo(() => ({ areFormAmountsValid: areFormAmountsValid(data) }), [data]);
};

const isReceivingAddressValid = (
  state: Pick<DefaultRootState['form'], 'receivingAddress'>,
): boolean => {
  return !!state.receivingAddress;
};

export const useIsReceivingAddressValid = () => {
  const data = useSelector((state) => state.form);
  return useMemo(() => ({ isReceivingAddressValid: isReceivingAddressValid(data) }), [data]);
};
