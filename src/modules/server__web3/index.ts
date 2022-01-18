import { SkybridgeMode, SkybridgeBridge } from '@swingby-protocol/sdk';
import Web3 from 'web3';

export const buildWeb3Instance = ({
  mode,
  bridge,
}: {
  mode: SkybridgeMode;
  bridge: SkybridgeBridge;
}) => {
  if (bridge === 'btc_erc') {
    const web3 = new Web3(
      new Web3.providers.HttpProvider(
        `https://${mode === 'production' ? 'mainnet' : 'ropsten'}.infura.io/v3/${
          process.env.INFURA_KEY
        }`,
      ),
    );
    return web3;
  }

  if (bridge === 'btc_bep20') {
    return new Web3(
      new Web3.providers.HttpProvider(
        mode === 'production'
          ? 'https://bsc-dataseed1.binance.org:443'
          : 'https://data-seed-prebsc-1-s1.binance.org:8545',
      ),
    );
  }

  throw new Error(`Could not build Web3 instance for "${bridge}"`);
};
