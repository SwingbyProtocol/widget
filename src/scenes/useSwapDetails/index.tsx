import { useEffect, useMemo, useState } from 'react';
import type { getSwapDetails as originalGetSwapDetails } from '@swingby-protocol/sdk';

import { logger } from '../../modules/logger';
import { useGetSwapDetails } from '../useGetSwapDetails';

type ThenArg<T> = T extends PromiseLike<infer U> ? U : T;
type Result = ThenArg<ReturnType<typeof originalGetSwapDetails>>;

type SwapDetails = { loading: true; swap: null } | { loading: boolean; swap: Result };

export const useSwapDetails = (): SwapDetails => {
  const { getSwapDetails } = useGetSwapDetails();
  const [swap, setSwap] = useState<null | Result>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);

    const id = setInterval(async () => {
      try {
        const swap = await getSwapDetails();

        logger.debug('getSwapDetails() returned: %O', swap);
        setSwap(swap);

        if (swap.status === 'completed' || swap.status === 'refunded') {
          setLoading(false);
          clearInterval(id);
        }
      } catch (e) {
        logger.error('Error trying to fetch swap details', e);
      }
    }, 5000);

    return () => clearInterval(id);
  }, [getSwapDetails]);

  return useMemo(() => ({ swap, loading }), [swap, loading]);
};
