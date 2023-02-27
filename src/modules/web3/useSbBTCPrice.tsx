import { getSbbtcPrice } from '@swingby-protocol/sdk';
import { useCallback, useMemo } from 'react';

import { logger } from '../logger';
import { useSdkContext } from '../store/sdkContext';

export const useSbBTCPrice = () => {
  const context = useSdkContext();

  const getCurrentPrice = useCallback(async () => {
    const results = await getSbbtcPrice({ context, bridge: 'btc_skypool' });

    const currentPrice = {
      'sbBTC.SKYPOOL': {
        priceSbBTC: Number(results),
      },
    };
    logger.debug('Current Price: %s', currentPrice);
    return currentPrice;
  }, [context]);

  return useMemo(() => ({ getCurrentPrice }), [getCurrentPrice]);
};
