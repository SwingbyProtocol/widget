import { useEffect, useMemo, useState } from 'react';
import { DefaultRootState, useDispatch, useSelector } from 'react-redux';

import { logger } from '../../modules/logger';
import { useGetSwapDetails } from '../useGetSwapDetails';
import { actionSetSwap } from '../../modules/store/swaps';

const MS_TILL_NEXT_TRY = 10000;

type SwapDetails = { loading: boolean; swap: null | DefaultRootState['swaps'][string] };

export const useSwapDetails = (): SwapDetails => {
  const { getSwapDetails, swapHash } = useGetSwapDetails();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const swap = useSelector((state) => state.swaps[swapHash]);

  useEffect(() => {
    let timeoutId: number | null = null;
    let cancelled = false;

    const doStuff = async () => {
      setLoading(true);

      try {
        const swap = await getSwapDetails();
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
  }, [dispatch, getSwapDetails]);

  return useMemo(() => ({ swap: swap ?? null, loading }), [swap, loading]);
};
