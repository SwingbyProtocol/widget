import { Button } from '@swingby-protocol/pulsar';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { buildShortAddress, useOnboard } from '../../../modules/web3';

import { ConnectWalletView } from './styled';

export const ConnectWallet = () => {
  const { address, onboard } = useOnboard();

  const logIn = useCallback(async () => {
    if (!onboard) return;
    await onboard.walletSelect();
    await onboard.walletCheck();
  }, [onboard]);

  const logOut = useCallback(async () => {
    if (!onboard) return;
    await onboard.walletReset();
  }, [onboard]);

  return (
    <ConnectWalletView>
      <Button
        variant={address ? 'secondary' : 'primary'}
        size="city"
        onClick={address ? logOut : logIn}
      >
        {address ? (
          buildShortAddress({ address })
        ) : (
          <FormattedMessage id="widget.onboard.connect-btn" />
        )}
      </Button>
    </ConnectWalletView>
  );
};
