import { getSbbtcPrice } from '@swingby-protocol/sdk';
import { useCallback, useMemo } from 'react';

import { logger } from '../logger';
import { useSdkContext } from '../store/sdkContext';

export const useSbBTCPrice = () => {
  const context = useSdkContext();

  const getCurrentPrice = useCallback(async () => {
    const results = await Promise.all([
      getSbbtcPrice({ context, bridge: 'btc_erc' }),
      getSbbtcPrice({ context, bridge: 'btc_skypool' }),
    ]);

    const currentPrice = {
      sbBTC: {
        priceSbBTC: Number(results[0]),
      },
      'sbBTC.SKYPOOL': {
        priceSbBTC: Number(results[1]),
      },
    };
    logger.debug('Current Price: %s', currentPrice);
    return currentPrice;
  }, [context]);

  return useMemo(() => ({ getCurrentPrice }), [getCurrentPrice]);
};
