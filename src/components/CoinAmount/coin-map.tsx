import { getChainFor, SkybridgeChain, SkybridgeCoin } from '@swingby-protocol/sdk';

export type CoinMap = Map<SkybridgeChain | 'skypools', SkybridgeCoin[]>;

const isSkypool = (networkName: string): boolean => /SKYPOOL$/.test(networkName);

export const buildCoinMap = (coins: SkybridgeCoin[]): CoinMap => {
  const map = new Map<SkybridgeChain | 'skypools', SkybridgeCoin[]>();

  coins.sort((coinA, coinB) => {
    if (isSkypool(coinA)) return -1;
    if (isSkypool(coinB)) return 1;
    return 0;
  });

  coins.forEach((it) => {
    const chain = getChainFor({ coin: it });
    const key = isSkypool(it) ? 'skypools' : chain;
    const value = map.get(key) ?? [];
    map.set(key, [...value, it]);
  });

  return map;
};

export const swingbyTextDisplay = (coin: SkybridgeCoin): string => {
  switch (coin) {
    case 'WBTC': {
      return 'WBTC (Legacy)';
    }
    case 'WBTC.SKYPOOL': {
      return 'WBTC';
    }
    case 'sbBTC': {
      return 'sbBTC (Legacy)';
    }
    case 'sbBTC.SKYPOOL': {
      return 'sbBTC';
    }
    default: {
      return coin;
    }
  }
};
