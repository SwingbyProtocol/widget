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
  const addressUserIn = useSelector((state) => state.swapForm.addressUserIn);
  const currencyIn = useSelector((state) => state.swapForm.currencyIn);
  const currencyOut = useSelector((state) => state.swapForm.currencyOut);
  const amountUser = useSelector((state) => state.swapForm.amountUser);
  const dispatch = useDispatch();
  const { push } = useRouter();

  const createSwap = useCallback(async () => {
    setLoading(true);

    logger.debug('Will call createSwap()', {
      addressUserIn,
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
        addressUserIn,
      });

      logger.debug('createSwap() has finished', swap);

      dispatch(actionClearSwapFormData());
      dispatch(actionSetSwap({ ...swap, status: 'WAITING' }));
      push(`${context.mode === 'test' ? '/test' : ''}/swap/${swap.hash}`);
    } finally {
      setLoading(false);
    }
  }, [context, addressUserIn, currencyIn, currencyOut, amountUser, push, dispatch]);

  return useMemo(() => ({ loading, createSwap }), [createSwap, loading]);
};
