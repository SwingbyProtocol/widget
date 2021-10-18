import { getChainFor, SkybridgeCoin, SkybridgeMode } from '@swingby-protocol/sdk';

export const getTransactionChainProp = ({
  mode,
  coin,
}: {
  mode: SkybridgeMode;
  coin: SkybridgeCoin;
}) => {
  const bridge = (() => {
    try {
      return getChainFor({ coin });
    } catch (e) {
      return null;
    }
  })();

  if (bridge !== 'ethereum') {
    return undefined;
  }

  return mode === 'production' ? 'mainnet' : 'ropsten';
};
