import { Big } from 'big.js';
import { useMemo } from 'react';
import { DefaultRootState, useSelector } from 'react-redux';
import {
  getChainFor,
  getCoinsFor,
  isAddressValid,
  SkybridgeResource,
  SkybridgeContext,
} from '@swingby-protocol/sdk';

import { useSdkContext } from '../../sdk-context';
import { logger } from '../../logger';

const areCurrenciesValid = ({
  resource,
  amountDesired,
  currencyDeposit,
  currencyReceiving,
  context,
}: Pick<DefaultRootState['swapForm'], 'currencyDeposit' | 'currencyReceiving' | 'amountDesired'> & {
  resource: SkybridgeResource;
  context: SkybridgeContext;
}): boolean => {
  const coinsIn = getCoinsFor({ context, resource, direction: 'in' });
  const coinsOut = getCoinsFor({ context, resource, direction: 'out' });
  if (!coinsIn.includes(currencyDeposit) || !coinsOut.includes(currencyReceiving)) {
    return false;
  }

  if (currencyDeposit === currencyReceiving) {
    return false;
  }

  try {
    new Big(amountDesired);
  } catch (e) {
    return false;
  }

  return true;
};

export const useAreCurrenciesValid = ({ resource }: { resource: SkybridgeResource }) => {
  const data = useSelector((state) => state.swapForm);
  const context = useSdkContext();
  return useMemo(
    () => ({ areCurrenciesValid: areCurrenciesValid({ ...data, context, resource }) }),
    [data, context, resource],
  );
};

export const useIsReceivingAddressValid = () => {
  const addressOut = useSelector((state) => state.swapForm.addressReceiving);
  const currencyReceiving = useSelector((state) => state.swapForm.currencyReceiving);
  const context = useSdkContext();
  return useMemo(() => {
    try {
      const chain = getChainFor({ coin: currencyReceiving });
      return { isReceivingAddressValid: isAddressValid({ context, address: addressOut, chain }) };
    } catch (e) {
      logger.error(e);
      return { isReceivingAddressValid: false };
    }
  }, [context, addressOut, currencyReceiving]);
};
