import { Button } from '@swingby-protocol/pulsar';
import React from 'react';

import { ConnectWalletView } from './styled';

export const ConnectWallet = () => {
  return (
    <ConnectWalletView>
      <Button variant="tertiary" size="city" onClick={() => console.log('hello')}>
        Connect Wallet
      </Button>
    </ConnectWalletView>
  );
};
