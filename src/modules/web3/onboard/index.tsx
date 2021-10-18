import Onboard from 'bnc-onboard';
import type { SkybridgeBridge, SkybridgeMode } from '@swingby-protocol/sdk';
import type { Subscriptions } from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line import/no-internal-modules

import { blocknativeApiKey, infuraApiKey } from '../../env';

const APP_NAME = 'Skybridge Widget';

const getEtherNetwork = ({ mode }: { mode: SkybridgeMode }) => {
  const network =
    mode === 'production' ? { id: 1, network: 'mainnet' } : { id: 3, network: 'ropsten' };

  return {
    id: network.id,
    rpcUrl: `https://${network.network}.infura.io/v3/${infuraApiKey}`,
  };
};

const getBscNetwork = ({ mode }: { mode: SkybridgeMode }) => {
  const id = mode === 'production' ? 56 : 97;
  return {
    id,
    rpcUrl:
      mode === 'production'
        ? 'https://bsc-dataseed1.binance.org:443'
        : 'https://data-seed-prebsc-1-s1.binance.org:8545',
  };
};

const getNetwork = ({ mode, bridge }: { mode: SkybridgeMode; bridge: SkybridgeBridge }) => {
  if (bridge === 'btc_bep20') {
    return getBscNetwork({ mode });
  }

  return getEtherNetwork({ mode });
};

export const initOnboard = ({
  subscriptions,
  mode,
  bridge,
}: {
  mode: SkybridgeMode;
  bridge: SkybridgeBridge;
  subscriptions: Subscriptions;
}) => {
  const { id: networkId, rpcUrl } = getNetwork({ mode, bridge });
  return Onboard({
    dappId: blocknativeApiKey,
    networkId,
    hideBranding: true,
    subscriptions,
    walletSelect: {
      wallets: [
        { walletName: 'metamask', preferred: true },
        {
          walletName: 'ledger',
          rpcUrl,
          preferred: true,
        },
        {
          walletName: 'walletConnect',
          infuraKey: infuraApiKey,
          preferred: true,
        },
        { walletName: 'walletLink', rpcUrl, appName: APP_NAME, preferred: true },
        { walletName: 'authereum' },
        { walletName: 'lattice', rpcUrl, appName: APP_NAME },
        { walletName: 'torus' },
        { walletName: 'opera' },
        {
          walletName: 'trezor',
          // Memo: Not sure if it is necessary to set the email
          // email: CONTACT_EMAIL,
          appUrl: APP_NAME,
          rpcUrl,
        },
      ],
    },
    walletCheck: [
      { checkName: 'derivationPath' },
      { checkName: 'connect' },
      { checkName: 'accounts' },
      { checkName: 'network' },
      { checkName: 'balance', minimumBalance: '100000' },
    ],
  });
};
