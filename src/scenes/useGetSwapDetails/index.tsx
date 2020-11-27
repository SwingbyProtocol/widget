import { getSwapDetails } from '@swingby-protocol/sdk';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { useSdkContext } from '../../modules/sdk-context';

export const useGetSwapDetails = () => {
  const { query } = useRouter();
  const context = useSdkContext();
  return useMemo(
    () => ({
      getSwapDetails: () => {
        const { swapHash } = query;
        if (typeof swapHash !== 'string') {
          throw new Error(`Invalid swap hash "${swapHash}"`);
        }

        return getSwapDetails({ context, hash: swapHash });
      },
    }),
    [query, context],
  );
};
