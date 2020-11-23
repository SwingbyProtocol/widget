import { BigNumber } from 'bignumber.js';
import { useMemo } from 'react';
import { DefaultRootState, useSelector } from 'react-redux';

import { isCoinSupported } from '../../coins';

const areCurrenciesValid = (
  state: Pick<DefaultRootState['swap'], 'currencyIn' | 'currencyOut' | 'amountUser'>,
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
  const data = useSelector((state) => state.swap);
  return useMemo(() => ({ areCurrenciesValid: areCurrenciesValid(data) }), [data]);
};

export const useIsAddressOutValid = () => {
  const addressOut = useSelector((state) => state.swap.addressOut);
  return useMemo(() => ({ isAddressOutValid: !!addressOut }), [addressOut]);
};
