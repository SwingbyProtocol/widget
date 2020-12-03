import { Big } from 'big.js';
import { useMemo } from 'react';
import { DefaultRootState, useSelector } from 'react-redux';
import { getChainFor, getCoinsFor, isAddressValid, SwingbyContext } from '@swingby-protocol/sdk';

import { useSdkContext } from '../../sdk-context';
import { logger } from '../../logger';

const areCurrenciesValid = ({
  amountUser,
  currencyIn,
  currencyOut,
  context,
}: Pick<DefaultRootState['swapForm'], 'currencyIn' | 'currencyOut' | 'amountUser'> & {
  context: SwingbyContext;
}): boolean => {
  const coins = getCoinsFor({ context });
  if (!coins.includes(currencyIn) || !coins.includes(currencyOut)) {
    return false;
  }

  if (currencyIn === currencyOut) {
    return false;
  }

  try {
    new Big(amountUser);
  } catch (e) {
    return false;
  }

  return true;
};

export const useAreCurrenciesValid = () => {
  const data = useSelector((state) => state.swapForm);
  const context = useSdkContext();
  return useMemo(() => ({ areCurrenciesValid: areCurrenciesValid({ ...data, context }) }), [
    data,
    context,
  ]);
};

export const useIsReceivingAddressValid = () => {
  const addressOut = useSelector((state) => state.swapForm.addressUserIn);
  const currencyOut = useSelector((state) => state.swapForm.currencyOut);
  const context = useSdkContext();
  return useMemo(() => {
    try {
      const chain = getChainFor({ coin: currencyOut });
      return { isReceivingAddressValid: isAddressValid({ context, address: addressOut, chain }) };
    } catch (e) {
      logger.error(e);
      return { isReceivingAddressValid: false };
    }
  }, [context, addressOut, currencyOut]);
};
