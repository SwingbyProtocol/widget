import { Big } from 'big.js';
import { useMemo } from 'react';
import { DefaultRootState, useSelector } from 'react-redux';
import { getNetworkForCoin, isAddressValid } from '@swingby-protocol/sdk';

import { isCoinSupported } from '../../coins';
import { useSdkContext } from '../../sdk-context';
import { logger } from '../../logger';

const areCurrenciesValid = (
  state: Pick<DefaultRootState['swapForm'], 'currencyIn' | 'currencyOut' | 'amountUser'>,
): boolean => {
  if (!isCoinSupported(state.currencyIn) || !isCoinSupported(state.currencyOut)) {
    return false;
  }

  if (state.currencyIn === state.currencyOut) {
    return false;
  }

  try {
    new Big(state.amountUser);
  } catch (e) {
    return false;
  }

  return true;
};

export const useAreCurrenciesValid = () => {
  const data = useSelector((state) => state.swapForm);
  return useMemo(() => ({ areCurrenciesValid: areCurrenciesValid(data) }), [data]);
};

export const useIsReceivingAddressValid = () => {
  const addressOut = useSelector((state) => state.swapForm.addressUserIn);
  const currencyOut = useSelector((state) => state.swapForm.currencyOut);
  const context = useSdkContext();
  return useMemo(() => {
    try {
      const network = getNetworkForCoin(currencyOut);
      return { isReceivingAddressValid: isAddressValid({ context, address: addressOut, network }) };
    } catch (e) {
      logger.error(e);
      return { isReceivingAddressValid: false };
    }
  }, [context, addressOut, currencyOut]);
};
