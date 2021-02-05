import { Button } from '@swingby-protocol/pulsar';
import { SkybridgeResource } from '@swingby-protocol/sdk';
import { API } from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line
import React, { useEffect, useState } from 'react';

import { useDetails } from '../../../modules/details';
import { useSdkContext } from '../../../modules/store/sdkContext';
import {
  ellipseAddress,
  erc20Token,
  getOnboard,
  login,
  mode,
  transferERC20,
} from '../../../modules/web3';

import { ConnectWalletView } from './styled';

export const ConnectWallet = ({ resource }: { resource: SkybridgeResource }) => {
  const [address, setAddress] = useState('');
  const [onboard, setOnboard] = useState<API | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [notify, setNotify] = useState<any>(null);
  const [web3, setWeb3] = useState<any>(null);
  const { swap } = useDetails({ resource });
  const context = useSdkContext();
  const mode = context.mode as mode;
  const addressReceiving = swap?.addressReceiving;
  const depositToken = swap?.currencyDeposit as erc20Token;
  const amountDeposit = String(swap?.amountDeposit);
  const addressDeposit = swap?.addressDeposit;

  useEffect(() => {
    if (depositToken && mode) {
      getOnboard({
        depositToken,
        mode,
        setAddress,
        setContract,
        setOnboard,
        setNotify,
        setWeb3,
      });
    }
  }, [depositToken, mode]);

  useEffect(() => {
    if (address && contract) {
      (async () => {
        await transferERC20({
          amountDeposit,
          addressDeposit,
          contract,
          address,
          notify,
          web3,
        });
      })();
    }
  }, [address, contract, addressReceiving, addressDeposit, amountDeposit, notify, web3]);

  return (
    <ConnectWalletView>
      <Button variant="tertiary" size="city" onClick={async () => await login(onboard)}>
        {address ? ellipseAddress(address) : 'Connect Wallet'}
      </Button>
    </ConnectWalletView>
  );
};
