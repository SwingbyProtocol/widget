import { createSwap as originalCreateSwap } from '@swingby-protocol/sdk';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { logger } from '../../logger';
import { useSdkContext } from '../../sdk-context';

import { actionSetSwapData } from './reducer';

export const useCreateSwap = () => {
  const [loading, setLoading] = useState(false);
  const context = useSdkContext();
  const addressOut = useSelector((state) => state.swap.addressOut);
  const currencyIn = useSelector((state) => state.swap.currencyIn);
  const currencyOut = useSelector((state) => state.swap.currencyOut);
  const amountUser = useSelector((state) => state.swap.amountUser);
  const dispatch = useDispatch();

  const createSwap = useCallback(async () => {
    setLoading(true);

    logger.debug('Will call createSwap()', {
      addressOut,
      currencyIn,
      currencyOut,
      amountUser,
    });

    try {
      const { addressIn, amountIn, timestamp } = await originalCreateSwap({
        context,
        amountUser,
        currencyOut,
        currencyIn,
        addressOut,
      });

      logger.debug('createSwap() has finished', { addressIn, timestamp });

      dispatch(actionSetSwapData({ amountIn, addressIn }));
    } finally {
      setLoading(false);
    }
  }, [context, addressOut, currencyIn, currencyOut, amountUser, dispatch]);

  return useMemo(() => ({ loading, createSwap }), [createSwap, loading]);
};
