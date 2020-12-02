import {
  isProductionCoin,
  isTestCoin,
  COINS_TEST,
  COINS_PRODUCTION,
  Coin,
  Mode,
} from '@swingby-protocol/sdk';

export const isCoinSupported = ({ mode, symbol }: { symbol: string; mode: Mode }): boolean => {
  if (mode === 'production') {
    return isProductionCoin(symbol);
  }

  return isTestCoin(symbol);
};

export const getCoinList = <M extends Mode>({ mode }: { mode: M }): Coin<M>[] =>
  ((mode === 'production' ? COINS_PRODUCTION : COINS_TEST) as unknown) as Coin<M>[];
