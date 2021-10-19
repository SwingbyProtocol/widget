import { Big } from 'big.js';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { getChainFor, getCoinsFor, isAddressValid, SkybridgeResource } from '@swingby-protocol/sdk';

import { logger } from '../../logger';
import { useSdkContext } from '../sdkContext';

export const useAreCurrenciesValid = ({ resource }: { resource: SkybridgeResource }) => {
  const currencyDeposit = useSelector((state) => state.swapForm.currencyDeposit);
  const currencyReceiving = useSelector((state) => state.swapForm.currencyReceiving);
  const amountDesired = useSelector((state) => state.swapForm.amountDesired);
  const context = useSdkContext();
  return useMemo((): {
    areCurrenciesAndAmountValid: boolean;
    isCurrencyDepositValid: boolean;
    isCurrencyReceivingValid: boolean;
    isAmountDesiredValid: boolean;
  } => {
    const coinsIn = getCoinsFor({ context, resource, direction: 'in' });
    const coinsOut = getCoinsFor({ context, resource, direction: 'out' });

    const isCurrencyDepositValid = coinsIn.includes(currencyDeposit);
    const isCurrencyReceivingValid =
      coinsOut.includes(currencyReceiving) && currencyDeposit !== currencyReceiving;
    const isAmountDesiredValid = (() => {
      try {
        return new Big(amountDesired).gte('0.0004');
      } catch (err) {
        return false;
      }
    })();

    return {
      areCurrenciesAndAmountValid:
        isCurrencyDepositValid && isCurrencyReceivingValid && isAmountDesiredValid,
      isCurrencyDepositValid,
      isCurrencyReceivingValid,
      isAmountDesiredValid,
    };
  }, [currencyDeposit, currencyReceiving, amountDesired, context, resource]);
};

export const useIsReceivingAddressValid = () => {
  const addressOut = useSelector((state) => state.swapForm.addressReceiving);
  const currencyReceiving = useSelector((state) => state.swapForm.currencyReceiving);
  const context = useSdkContext();
  return useMemo(() => {
    try {
      const chain = getChainFor({ coin: currencyReceiving });
      return { isReceivingAddressValid: isAddressValid({ context, address: addressOut, chain }) };
    } catch (err) {
      logger.error({ err });
      return { isReceivingAddressValid: false };
    }
  }, [context, addressOut, currencyReceiving]);
};
