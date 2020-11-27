import { createSwap as originalCreateSwap } from '@swingby-protocol/sdk';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import { logger } from '../../logger';
import { useSdkContext } from '../../sdk-context';

export const useCreateSwap = () => {
  const [loading, setLoading] = useState(false);
  const context = useSdkContext();
  const addressOut = useSelector((state) => state.swap.addressOut);
  const currencyIn = useSelector((state) => state.swap.currencyIn);
  const currencyOut = useSelector((state) => state.swap.currencyOut);
  const amountUser = useSelector((state) => state.swap.amountUser);
  const { push } = useRouter();

  const createSwap = useCallback(async () => {
    setLoading(true);

    logger.debug('Will call createSwap()', {
      addressOut,
      currencyIn,
      currencyOut,
      amountUser,
    });

    try {
      const { addressIn, timestamp, hash } = await originalCreateSwap({
        context,
        amountUser,
        currencyOut,
        currencyIn,
        addressOut,
      });

      logger.debug('createSwap() has finished', { addressIn, timestamp });

      push(`/swap/${hash}`);
    } finally {
      setLoading(false);
    }
  }, [context, addressOut, currencyIn, currencyOut, amountUser, push]);

  return useMemo(() => ({ loading, createSwap }), [createSwap, loading]);
};
