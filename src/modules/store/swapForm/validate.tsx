import { Big } from 'big.js';
import { useMemo } from 'react';
import { DefaultRootState, useSelector } from 'react-redux';
import {
  getChainFor,
  getCoinsFor,
  isAddressValid,
  SkybridgeAction,
  SkybridgeContext,
} from '@swingby-protocol/sdk';

import { useSdkContext } from '../../sdk-context';
import { logger } from '../../logger';

const areCurrenciesValid = ({
  action,
  amountUser,
  currencyIn,
  currencyOut,
  context,
}: Pick<DefaultRootState['swapForm'], 'currencyIn' | 'currencyOut' | 'amountUser'> & {
  action: SkybridgeAction;
  context: SkybridgeContext;
}): boolean => {
  const coinsIn = getCoinsFor({ context, action, direction: 'in' });
  const coinsOut = getCoinsFor({ context, action, direction: 'out' });
  if (!coinsIn.includes(currencyIn) || !coinsOut.includes(currencyOut)) {
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

export const useAreCurrenciesValid = ({ action }: { action: SkybridgeAction }) => {
  const data = useSelector((state) => state.swapForm);
  const context = useSdkContext();
  return useMemo(() => ({ areCurrenciesValid: areCurrenciesValid({ ...data, context, action }) }), [
    data,
    context,
    action,
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
