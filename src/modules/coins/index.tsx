import {
  isProductionCoin,
  isTestCoin,
  COINS_TEST,
  COINS_PRODUCTION,
  Coin,
} from '@swingby-protocol/sdk';

import { mode } from '../env';

export const isCoinSupported = (symbol: string): boolean => {
  if (mode === 'production') {
    return isProductionCoin(symbol);
  }

  return isTestCoin(symbol);
};

export const getCoinList = (): Coin[] =>
  ((mode === 'production' ? COINS_PRODUCTION : COINS_TEST) as unknown) as Coin[];
