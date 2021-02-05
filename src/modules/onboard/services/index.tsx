import Onboard from 'bnc-onboard';
import Notify from 'bnc-notify';

import { blocknativeApiKey, getEtherNetwork, getRpcUrl, infuraApiKey, appName } from '../../env';
import { IInitOnboardArg, mode } from '../../web3';

// Ref: https://github.com/blocknative/react-demo/blob/master/src/services.js

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
        { walletName: 'walletLink', rpcUrl, appName, preferred: true },
        { walletName: 'authereum' },
        { walletName: 'lattice', rpcUrl, appName },
        { walletName: 'torus' },
        { walletName: 'opera' },
        {
          walletName: 'trezor',
          // Memo: Not sure if it is necessary to set the email
          // email: CONTACT_EMAIL,
          appUrl: appName,
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

export const initNotify = (mode: mode) => {
  const etherNetwork = getEtherNetwork(mode);
  return Notify({
    dappId: blocknativeApiKey,
    networkId: etherNetwork.id,
    desktopPosition: 'topRight',
  });
};
