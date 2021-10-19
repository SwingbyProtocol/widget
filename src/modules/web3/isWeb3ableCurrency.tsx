import { CONTRACTS, getChainFor } from '@swingby-protocol/sdk';
import type { Except } from 'type-fest';

export const isWeb3ableCurrency = (
  coin: string,
): coin is keyof Except<typeof CONTRACTS.coins, 'BTC'> => {
  try {
    if (typeof coin !== 'string') return false;
    return ['ethereum', 'binance-smart'].includes(getChainFor({ coin: coin as any }));
  } catch (err) {
    return false;
  }
};
