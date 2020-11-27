import { useEffect, useMemo, useState } from 'react';
import { DefaultRootState, useDispatch, useSelector } from 'react-redux';

import { logger } from '../../modules/logger';
import { useGetSwapDetails } from '../useGetSwapDetails';
import { actionSetSwap } from '../../modules/store/swaps';

type SwapDetails = { loading: boolean; swap: null | DefaultRootState['swaps'][string] };

export const useSwapDetails = (): SwapDetails => {
  const { getSwapDetails, swapHash } = useGetSwapDetails();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const swap = useSelector((state) => state.swaps[swapHash]);

  useEffect(() => {
    if (swap?.status === 'completed' || swap?.status === 'refunded') return;

    setLoading(true);
    const id = setInterval(async () => {
      try {
        const swap = await getSwapDetails();

        logger.debug('getSwapDetails() returned: %O', swap);
        dispatch(actionSetSwap({ ...swap }));

        if (swap.status === 'completed' || swap.status === 'refunded') {
          setLoading(false);
          clearInterval(id);
        }
      } catch (e) {
        logger.error('Error trying to fetch swap details', e);
      }
    }, 5000);

    return () => {
      clearInterval(id);
      setLoading(false);
    };
  }, [getSwapDetails, dispatch, swap?.status]);

  return useMemo(() => ({ swap: swap ?? null, loading }), [swap, loading]);
};
