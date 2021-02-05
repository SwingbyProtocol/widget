import Onboard from 'bnc-onboard';
import { SkybridgeMode } from '@swingby-protocol/sdk';
import type { Subscriptions } from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line import/no-internal-modules

import { blocknativeApiKey, infuraApiKey } from '../../env';

const APP_NAME = 'Skybridge Widget';

const getEtherNetwork = ({ mode }: { mode: SkybridgeMode }) =>
  mode === 'production' ? { id: 1, network: 'mainnet' } : { id: 5, network: 'goerli' };

export const initOnboard = ({
  subscriptions,
  mode,
}: {
  mode: SkybridgeMode;
  subscriptions: Subscriptions;
}) => {
  const etherNetwork = getEtherNetwork({ mode });
  const rpcUrl = `https://${etherNetwork.network}.infura.io/v3/${infuraApiKey}`;

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
