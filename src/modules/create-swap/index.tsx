import { createFloat, createSwap, SkybridgeResource } from '@swingby-protocol/sdk';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { logger } from '../logger';
import { useSdkContext } from '../sdk-context';
import { actionClearSwapFormData } from '../store/swapForm';
import { actionSetSwap } from '../store/swaps';

export const useCreate = ({ resource }: { resource: SkybridgeResource }) => {
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
        if (resource === 'swap') {
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

        if (resource === 'pool') {
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

        throw new Error(`Invalid action "${resource}"`);
      })();

      push(`${context.mode}/${resource}/${hash}`);
    } finally {
      setLoading(false);
    }
  }, [context, addressUserIn, currencyIn, currencyOut, amountUser, push, dispatch, resource]);

  return useMemo(() => ({ loading, create }), [create, loading]);
};
