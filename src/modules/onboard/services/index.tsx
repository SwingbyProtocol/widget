import Onboard from 'bnc-onboard';

import { blocknativeApiKey, ETHER_NETWORK, infuraApiKey, infuraAppName, RPC_URL } from '../../env';

// Ref: https://github.com/blocknative/react-demo/blob/master/src/services.js
export const initOnboard = ({ subscriptions }) => {
  return Onboard({
    dappId: blocknativeApiKey,
    networkId: ETHER_NETWORK.id,
    hideBranding: true,
    subscriptions,
    walletSelect: {
      wallets: [
        { walletName: 'metamask', preferred: true },
        {
          walletName: 'ledger',
          rpcUrl: RPC_URL,
          preferred: true,
        },
        {
          walletName: 'walletConnect',
          infuraKey: infuraApiKey,
          preferred: true,
        },
        { walletName: 'walletLink', rpcUrl: RPC_URL, appName: infuraAppName, preferred: true },
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
