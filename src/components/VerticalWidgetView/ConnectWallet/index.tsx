import { Button } from '@swingby-protocol/pulsar';
import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { buildShortAddress, useOnboard } from '../../../modules/web3';

export const ConnectWallet = () => {
  const { address, onboard } = useOnboard();

  const logIn = useCallback(async () => {
    if (!onboard) return;
    await onboard.walletSelect();
    const checkResult = await onboard.walletCheck();
    if (!checkResult) {
      throw new Error('Invalid wallet/network selected');
    }
  }, [onboard]);

  const logOut = useCallback(() => {
    if (!onboard) return;
    onboard.walletReset();
  }, [onboard]);

  return (
    <Button
      variant={address ? 'secondary' : 'primary'}
      size="street"
      onClick={address ? logOut : logIn}
      shape="fit"
    >
      {address ? (
        buildShortAddress({ address })
      ) : (
        <FormattedMessage id="widget.onboard.connect-btn" />
      )}
    </Button>
  );
};
