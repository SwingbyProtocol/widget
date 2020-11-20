import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';
import { DefaultRootState, useSelector } from 'react-redux';

import { isCoinSupported } from '../../coins';

const areCurrenciesValid = (
  state: Pick<DefaultRootState['form'], 'currencyIn' | 'currencyOut' | 'amountUser'>,
): boolean => {
  if (!isCoinSupported(state.currencyIn) || !isCoinSupported(state.currencyOut)) {
    return false;
  }

  if (state.currencyIn === state.currencyOut) {
    return false;
  }

  if (new BigNumber(state.amountUser).isNaN()) {
    return false;
  }

  return true;
};

export const useAreCurrenciesValid = () => {
  const data = useSelector((state) => state.form);
  return useMemo(() => ({ areCurrenciesValid: areCurrenciesValid(data) }), [data]);
};

export const useIsAddressOutValid = () => {
  const addressOut = useSelector((state) => state.form.addressOut);
  return useMemo(() => ({ isAddressOutValid: () => !!addressOut }), [addressOut]);
};
