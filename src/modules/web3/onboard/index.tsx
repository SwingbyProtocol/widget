import type { SkybridgeBridge, SkybridgeMode } from '@swingby-protocol/sdk';
import Onboard from 'bnc-onboard';
import type { Subscriptions } from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line import/no-internal-modules

import { blocknativeApiKey, infuraApiKey, walletConnectBridge } from '../../env';
import { saveToStorageWithExpiry, loadFromStorageWithExpiry } from '../../local-storage';

const APP_NAME = 'Skybridge Widget';

const LAST_USED_PROVIDER_KEY = 'ONBOARD__lastUsedProvider';

const getEtherNetwork = ({ mode }: { mode: SkybridgeMode }) => {
  const network =
    mode === 'production' ? { id: 1, network: 'mainnet' } : { id: 3, network: 'ropsten' };

  return {
    id: network.id,
    rpcUrl: `https://${network.network}.infura.io/v3/${infuraApiKey}`,
  };
};

const getNetwork = ({ mode }: { mode: SkybridgeMode; bridge: SkybridgeBridge }) => {
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
          bridge: walletConnectBridge,
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

export const saveLastUsedProvider = (name: string): void => {
  const expireInDays = (days: number) => 60 * 60 * 24 * 1000 * days;
  const expiry = expireInDays(365);
  saveToStorageWithExpiry(LAST_USED_PROVIDER_KEY, name, expiry);
};

export const loadLastUsedProvider = (): string | undefined => {
  return loadFromStorageWithExpiry<string>(LAST_USED_PROVIDER_KEY);
};
