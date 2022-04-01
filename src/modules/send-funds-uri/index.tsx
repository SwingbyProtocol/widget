import { getChainFor, SkybridgeCoin } from '@swingby-protocol/sdk';
import type { BigSource } from 'big.js';

export const getTransferUriFor = ({
  address,
  coin,
  amount,
}: {
  address: string;
  coin: SkybridgeCoin;
  amount?: BigSource;
}): string => {
  const chain = getChainFor({ coin });
  switch (chain) {
    case 'bitcoin':
      return `bitcoin:${address}${amount ? `?amount=${amount}` : ''}`;
    case 'ethereum':
      return `${address}`;
  }
};
