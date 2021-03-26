import { useCallback, useEffect, useMemo, useState } from 'react';
import { SkybridgeCoin } from '@swingby-protocol/sdk';

import { logger } from '../logger';

import { useOnboard } from './context';
import { useGetTokenAllowance } from './useGetTokenAllowance';
import { isWeb3ableCurrency } from './isWeb3ableCurrency';

export const useTokenAllowance = ({
  currency,
  spenderAddress,
}: {
  currency?: SkybridgeCoin | null;
  spenderAddress?: string | null;
}) => {
  const { address } = useOnboard();
  const [allowance, setAllowance] = useState<string | null>(null);
  const { getTokenAllowance } = useGetTokenAllowance();

  const recheck = useCallback(async () => {
    if (!address || !currency || !spenderAddress || !isWeb3ableCurrency(currency)) {
      logger.debug({ address, currency, spenderAddress }, 'Will not check token allowance');
      return;
    }

    try {
      const result = await getTokenAllowance({
        currency,
        spenderAddress,
      });

      setAllowance(result);
    } catch (e) {
      logger.error(e, 'Failed to get allowance');
      setAllowance(null);
    }
  }, [address, spenderAddress, currency, getTokenAllowance]);

  useEffect(() => {
    recheck();
  }, [recheck]);

  return useMemo(() => ({ allowance, recheck }), [allowance, recheck]);
};
