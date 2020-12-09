import { getSwapDetails } from '@swingby-protocol/sdk';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { useSdkContext } from '../../modules/sdk-context';

export const useGetSwapDetails = () => {
  const {
    query: { hash: swapHashParam },
  } = useRouter();
  const context = useSdkContext();

  const swapHash = typeof swapHashParam === 'string' ? swapHashParam : '';

  return useMemo(
    () => ({
      swapHash,
      getSwapDetails: () => getSwapDetails({ context, hash: swapHash }),
    }),
    [context, swapHash],
  );
};
