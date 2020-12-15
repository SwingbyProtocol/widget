import { getSwapDetails } from '@swingby-protocol/sdk';
import { useEffect, useMemo, useState } from 'react';
import { DefaultRootState, useDispatch, useSelector } from 'react-redux';

import { logger } from '../../logger';
import { useWidgetPathParams } from '../../path-params';
import { useSdkContext } from '../../sdk-context';
import { actionSetSwap } from '../../store/swaps';

const MS_TILL_NEXT_TRY = 10000;

type SwapDetails = { loading: boolean; swap: null | DefaultRootState['swaps'][string] };

export const useSwapDetails = (): SwapDetails => {
  const { hash: hashParam } = useWidgetPathParams();
  const hash = hashParam ?? '';

  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const swap = useSelector((state) => state.swaps[hash]);
  const context = useSdkContext();

  useEffect(() => {
    let timeoutId: number | null = null;
    let cancelled = false;

    const doStuff = async () => {
      setLoading(true);

      try {
        const swap = await getSwapDetails({ context, hash });
        if (cancelled) {
          return;
        }

        logger.debug('getSwapDetails() returned: %O', swap);
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
  }, [dispatch, hash, context]);

  return useMemo(() => ({ swap: swap ?? null, loading }), [swap, loading]);
};
