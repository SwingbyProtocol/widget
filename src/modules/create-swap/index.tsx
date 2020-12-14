import { createFloat, createSwap, SkybridgeAction } from '@swingby-protocol/sdk';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { logger } from '../logger';
import { useSdkContext } from '../sdk-context';
import { actionClearSwapFormData } from '../store/swapForm';
import { actionSetSwap } from '../store/swaps';

export const useCreate = ({ action }: { action: SkybridgeAction }) => {
  const [loading, setLoading] = useState(false);
  const context = useSdkContext();
  const addressUserIn = useSelector((state) => state.swapForm.addressUserIn);
  const currencyIn = useSelector((state) => state.swapForm.currencyIn);
  const currencyOut = useSelector((state) => state.swapForm.currencyOut);
  const amountUser = useSelector((state) => state.swapForm.amountUser);
  const dispatch = useDispatch();
  const { push } = useRouter();

  const create = useCallback(async () => {
    setLoading(true);

    logger.debug('Will call createSwap()', {
      addressUserIn,
      currencyIn,
      currencyOut,
      amountUser,
    });

    try {
      const { hash } = await (async () => {
        if (action === 'swap') {
          const swap = await createSwap({
            context,
            amountUser,
            currencyOut: currencyOut as any,
            currencyIn: currencyIn as any,
            addressUserIn,
          });

          logger.debug('createSwap() has finished', swap);

          dispatch(actionClearSwapFormData());
          dispatch(actionSetSwap({ ...swap, status: 'WAITING' }));

          return swap;
        }

        if (action === 'float') {
          const swap = await createFloat({
            context,
            amountUser,
            currencyIn: currencyIn as any,
            addressUserIn,
          });

          logger.debug('createFloat() has finished', swap);

          dispatch(actionClearSwapFormData());
          dispatch(actionSetSwap({ ...swap, status: 'WAITING' }));

          return swap;
        }

        throw new Error(`Invalid action "${action}"`);
      })();

      push(`${context.mode === 'test' ? '/test' : ''}/${action}/${hash}`);
    } finally {
      setLoading(false);
    }
  }, [context, addressUserIn, currencyIn, currencyOut, amountUser, push, dispatch, action]);

  return useMemo(() => ({ loading, create }), [create, loading]);
};
