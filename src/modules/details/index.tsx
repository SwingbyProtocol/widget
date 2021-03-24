import { getFloatDetails, getSwapDetails, getWithdrawalDetails } from '@swingby-protocol/sdk';
import { useEffect, useMemo, useState } from 'react';
import { DefaultRootState, useDispatch, useSelector } from 'react-redux';

import { logger } from '../logger';
import { useWidgetPathParams } from '../path-params';
import { useSdkContext } from '../store/sdkContext';
import { actionSetSwap } from '../store/swaps';

const MS_TILL_NEXT_TRY = 10000;

type SwapDetails = { loading: boolean; swap: null | DefaultRootState['swaps'][string] };

export const useDetails = (): SwapDetails => {
  const { hash: hashParam, resource } = useWidgetPathParams();
  const hash = hashParam ?? '';

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const swap = useSelector((state) => state.swaps[hash]);
  const context = useSdkContext();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout | null = null;
    let cancelled = false;

    const doStuff = async () => {
      setLoading(true);

      try {
        const swap = await (async () => {
          if (resource === 'swap') {
            const result = await getSwapDetails({ context, hash });
            logger.debug('getSwapDetails() returned: %O', result);
            return result;
          }

          if (resource === 'pool') {
            const result = await getFloatDetails({ context, hash });
            logger.debug('getFloatDetails() returned: %O', result);
            return result;
          }

          if (resource === 'withdrawal') {
            const result = await getWithdrawalDetails({ context, hash });
            logger.debug('getWithdrawalDetails() returned: %O', result);
            return result;
          }

          throw new Error(`Invalid resource "${resource}"`);
        })();
        if (cancelled) {
          return;
        }

        dispatch(actionSetSwap({ ...swap }));

        if (
          swap.status === 'COMPLETED' ||
          swap.status === 'REFUNDED' ||
          swap.status === 'EXPIRED'
        ) {
          setLoading(false);
          return;
        }

        timeoutId = setTimeout(doStuff, MS_TILL_NEXT_TRY);
      } catch (e) {
        logger.error('Error trying to fetch swap details', e);
        timeoutId = setTimeout(doStuff, MS_TILL_NEXT_TRY);
      }
    };

    doStuff();

    return () => {
      cancelled = true;

      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
    };
  }, [dispatch, hash, context, resource]);

  return useMemo(() => ({ swap: swap ?? null, loading }), [swap, loading]);
};
