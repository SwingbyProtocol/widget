import { Big } from 'big.js';
import { useMemo } from 'react';
import { DefaultRootState, useSelector } from 'react-redux';
import { getNetworkForCoin, isAddressValid, Mode } from '@swingby-protocol/sdk';

import { isCoinSupported } from '../../coins';
import { useSdkContext } from '../../sdk-context';
import { logger } from '../../logger';

const areCurrenciesValid = ({
  amountUser,
  currencyIn,
  currencyOut,
  mode,
}: Pick<DefaultRootState['swapForm'], 'currencyIn' | 'currencyOut' | 'amountUser'> & {
  mode: Mode;
}): boolean => {
  if (
    !isCoinSupported({ mode, symbol: currencyIn }) ||
    !isCoinSupported({ mode, symbol: currencyOut })
  ) {
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
  return useMemo(
    () => ({ areCurrenciesValid: areCurrenciesValid({ ...data, mode: context.mode }) }),
    [data, context],
  );
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
