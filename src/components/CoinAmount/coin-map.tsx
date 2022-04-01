import { getChainFor, SkybridgeChain, SkybridgeCoin } from '@swingby-protocol/sdk';

export type CoinMap = Map<SkybridgeChain | 'skypools', SkybridgeCoin[]>;

export const buildCoinMap = (coins: SkybridgeCoin[]): CoinMap => {
  const map = new Map<SkybridgeChain | 'skypools', SkybridgeCoin[]>();

  coins.forEach((it) => {
    const isSkypools = /SKYPOOL$/.test(it);
    const chain = getChainFor({ coin: it });
    const key = isSkypools ? 'skypools' : chain;
    const value = map.get(key) ?? [];
    map.set(key, [...value, it]);
  });

  return map;
};
