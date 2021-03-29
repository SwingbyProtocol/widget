import { getChainFor, SkybridgeChain, SkybridgeCoin } from '@swingby-protocol/sdk';

export type CoinMap = Map<SkybridgeChain, SkybridgeCoin[]>;

export const buildCoinMap = (coins: SkybridgeCoin[]): CoinMap => {
  const map = new Map<SkybridgeChain, SkybridgeCoin[]>();

  coins.forEach((it) => {
    const chain = getChainFor({ coin: it });
    const value = map.get(chain) ?? [];
    map.set(chain, [...value, it]);
  });

  return map;
};
