import { useCallback, useMemo } from 'react';
import { CONTRACTS, SkybridgeCoin } from '@swingby-protocol/sdk';
import { Big } from 'big.js';
import Web3 from 'web3';

import { useSdkContext } from '../store/sdkContext';

import { useOnboard } from './context';

export const useGetTokenAllowance = () => {
  const context = useSdkContext();
  const { onboard, wallet, address } = useOnboard();

  const getTokenAllowance = useCallback(
    async ({ currency, spenderAddress }: { currency: SkybridgeCoin; spenderAddress: string }) => {
      if (!onboard) {
        throw new Error('Onboard has not been initialised');
      }

      if (!address || !wallet) {
        throw new Error('No wallet has been connected');
      }

      if (currency !== 'WBTC' && currency !== 'sbBTC') {
        throw new Error(`Invalid "currency": "${currency}"`);
      }

      await onboard.walletCheck();
      const web3 = new Web3(wallet.provider);
      const contract = new web3.eth.Contract(
        CONTRACTS[currency][context.mode].abi,
        CONTRACTS[currency][context.mode].address,
        wallet.provider,
      );

      return new Big(await contract.methods.allowance(address, spenderAddress).call()).div(
        `1e${await contract.methods.decimals().call()}`,
      );
    },
    [onboard, context, address, wallet],
  );

  return useMemo(() => ({ getTokenAllowance }), [getTokenAllowance]);
};
