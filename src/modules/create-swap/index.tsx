import { createSwap as originalCreateSwap } from '@swingby-protocol/sdk';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { logger } from '../logger';
import { useSdkContext } from '../sdk-context';
import { actionClearSwapFormData } from '../store/swapForm';
import { actionSetSwap } from '../store/swaps';

export const useCreateSwap = () => {
  const [loading, setLoading] = useState(false);
  const context = useSdkContext();
  const addressOut = useSelector((state) => state.swapForm.addressOut);
  const currencyIn = useSelector((state) => state.swapForm.currencyIn);
  const currencyOut = useSelector((state) => state.swapForm.currencyOut);
  const amountUser = useSelector((state) => state.swapForm.amountUser);
  const dispatch = useDispatch();
  const { push } = useRouter();

  const createSwap = useCallback(async () => {
    setLoading(true);

    logger.debug('Will call createSwap()', {
      addressOut,
      currencyIn,
      currencyOut,
      amountUser,
    });

    try {
      const swap = await originalCreateSwap({
        context,
        amountUser,
        currencyOut,
        currencyIn,
        addressOut,
      });

      logger.debug('createSwap() has finished', swap);

      dispatch(actionClearSwapFormData());
      dispatch(actionSetSwap({ ...swap, status: 'waiting' }));
      push(`/swap/${swap.hash}`);
    } finally {
      setLoading(false);
    }
  }, [context, addressOut, currencyIn, currencyOut, amountUser, push, dispatch]);

  return useMemo(() => ({ loading, createSwap }), [createSwap, loading]);
};
