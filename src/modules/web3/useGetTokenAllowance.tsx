import { useCallback, useMemo } from 'react';
import { CONTRACTS, SkybridgeCoin } from '@swingby-protocol/sdk';
import { Big } from 'big.js';
import Web3 from 'web3';

import { useSdkContext } from '../store/sdkContext';
import { logger } from '../logger';

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

      if (!(await onboard.walletCheck())) {
        throw new Error('Invalid wallet/network selected');
      }

      const web3 = new Web3(wallet.provider);
      const contract = new web3.eth.Contract(
        CONTRACTS.coins[currency][context.mode].abi,
        CONTRACTS.coins[currency][context.mode].address,
        wallet.provider,
      );

      const allowance = await contract.methods.allowance(address, spenderAddress).call();
      logger.debug('Allowance call returned: %s', allowance);

      const decimals = await contract.methods.decimals().call();
      logger.debug('Decimals call returned: %s', decimals);

      const result = new Big(allowance).div(`1e${decimals}`).toFixed();
      logger.debug('%s %s allowance for %s', result, currency, spenderAddress);

      return result;
    },
    [onboard, context, address, wallet],
  );

  return useMemo(() => ({ getTokenAllowance }), [getTokenAllowance]);
};
