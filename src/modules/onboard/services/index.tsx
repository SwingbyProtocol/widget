import Onboard from 'bnc-onboard';
import Notify from 'bnc-notify';

import {
  blocknativeApiKey,
  getEtherNetwork,
  getRpcUrl,
  infuraApiKey,
  infuraAppName,
} from '../../env';
import { IInitOnboardArg, mode } from '../../web3';

// Ref: https://github.com/blocknative/react-demo/blob/master/src/services.js

// export const initOnboard = ({ subscriptions, mode }) => {
export const initOnboard = (data: IInitOnboardArg) => {
  const { subscriptions, mode } = data;
  const etherNetwork = getEtherNetwork(mode);
  const rpcUrl = getRpcUrl(etherNetwork);
  return Onboard({
    dappId: blocknativeApiKey,
    networkId: etherNetwork.id,
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
        { walletName: 'walletLink', rpcUrl, appName: infuraAppName, preferred: true },
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

export const initNotify = (mode: mode) => {
  const etherNetwork = getEtherNetwork(mode);
  return Notify({
    dappId: blocknativeApiKey,
    networkId: etherNetwork.id,
    desktopPosition: 'topRight',
  });
};
