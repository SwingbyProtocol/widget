import { Button } from '@swingby-protocol/pulsar';
import { SkybridgeResource } from '@swingby-protocol/sdk';
import { API } from 'bnc-onboard/dist/src/interfaces'; // eslint-disable-line
import React, { useCallback, useEffect, useState } from 'react';

import { useDetails } from '../../../modules/details';
import { initOnboard } from '../../../modules/onboard';
import { useSdkContext } from '../../../modules/store/sdkContext';
import {
  ethereumToken,
  getHexValue,
  initWeb3,
  mode,
  updateWalletAddress,
} from '../../../modules/web3';

import { ConnectWalletView } from './styled';

export const ConnectWallet = ({ resource }: { resource: SkybridgeResource }) => {
  const [address, setAddress] = useState('');
  const [onboard, setOnboard] = useState<API | null>(null);
  const [contract, setContract] = useState<any>(null);
  const [walletName, setWalletName] = useState('');
  const { swap } = useDetails({ resource });
  const context = useSdkContext();
  const mode = context.mode as mode;
  const addressReceiving = swap?.addressReceiving;
  const depositToken = swap?.currencyDeposit as ethereumToken;
  const amountDeposit = String(swap?.amountDeposit);
  const addressDeposit = swap?.addressDeposit;

  const login = async () => {
    // console.log('walletName', walletName);
    await onboard.walletSelect(walletName);
    await onboard.walletCheck();
  };
  // const login = useCallback(async () => {
  //   console.log('hi');
  //   await onboard.walletSelect();
  //   await onboard.walletCheck();
  // }, [onboard]);

  useEffect(() => {
    const onboardData = initOnboard({
      subscriptions: {
        address: (walletAddress: string) => updateWalletAddress(walletAddress, setAddress),
        wallet: (wallet: any) => {
          setWalletName(wallet.name);
          const provider = wallet.provider;
          depositToken && mode && provider && initWeb3({ wallet, depositToken, mode, setContract });
        },
      },
    });
    setOnboard(onboardData);
  }, [depositToken, mode, contract]);

  useEffect(() => {
    onboard && onboard.walletReset();
    setAddress('');
  }, [onboard]);

  useEffect(() => {
    if (address && contract) {
      (async () => {
        const numberOfTokens = getHexValue(amountDeposit);
        contract.methods.transfer(addressDeposit, numberOfTokens).send({
          from: address,
        });
      })();
    }
  }, [address, contract, addressReceiving, addressDeposit, amountDeposit]);

  // useEffect(() => {
  //   (async () => {
  //     if (onboard && !address) {
  //       await login();
  //     }
  //   })();
  // }, [onboard, address, login]);

  const ellipseAddress = (address: string, width: number = 5): string => {
    return address && `${address.slice(0, width)}...${address.slice(-width)}`;
  };

  return (
    <ConnectWalletView>
      <Button variant="tertiary" size="city" onClick={async () => await login()}>
        {address ? ellipseAddress(address) : 'Connect Wallet'}
      </Button>
    </ConnectWalletView>
  );
};
