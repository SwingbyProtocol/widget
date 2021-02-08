import { useCallback, useMemo, useState } from 'react';
import { CONTRACTS, SkybridgeCoin } from '@swingby-protocol/sdk';
import { Big } from 'big.js';
import Web3 from 'web3';
import { TransactionConfig } from 'web3-eth';

import { useSdkContext } from '../store/sdkContext';
import { logger } from '../logger';

import { useOnboard } from './context';

export const useApproveTokenAllowance = () => {
  const context = useSdkContext();
  const { onboard, wallet, address } = useOnboard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const approveTokenAllowance = useCallback(
    async ({
      currency,
      spenderAddress,
      amount,
    }: {
      currency: SkybridgeCoin;
      spenderAddress: string;
      amount: string;
    }) => {
      try {
        if (!onboard) {
          throw new Error('Onboard has not been initialised');
        }

        if (!address || !wallet) {
          throw new Error('No wallet has been connected');
        }

        if (currency !== 'WBTC' && currency !== 'sbBTC') {
          throw new Error(`Invalid "currency": "${currency}"`);
        }

        setLoading(true);
        setError(null);

        await onboard.walletCheck();
        const web3 = new Web3(wallet.provider);
        const contract = new web3.eth.Contract(
          CONTRACTS[currency][context.mode].abi,
          CONTRACTS[currency][context.mode].address,
          wallet.provider,
        );

        const decimals = await contract.methods.decimals().call();
        const gasPrice = await web3.eth.getGasPrice();
        const rawTx: TransactionConfig = {
          nonce: await web3.eth.getTransactionCount(address),
          gasPrice: web3.utils.toHex(gasPrice),
          from: address,
          to: CONTRACTS[currency][context.mode].address,
          value: '0x0',
          data: contract.methods
            .approve(spenderAddress, new Big(amount).times(`1e${decimals}`).toFixed())
            .encodeABI(),
        };

        const estimatedGas = await web3.eth.estimateGas({ ...rawTx, from: address });
        logger.debug(
          'Estimated gas that will be spent %s (price: %s ETH)',
          estimatedGas,
          web3.utils.fromWei(gasPrice, 'ether'),
        );

        return web3.eth
          .sendTransaction({
            ...rawTx,
            gas: estimatedGas,
            chain: context.mode === 'production' ? 'mainnet' : 'goerli',
          })
          .on('receipt', () => {
            setLoading(false);
          })
          .on('error', (error) => {
            setError(error);
          });
      } catch (e) {
        setLoading(false);
        setError(e);
        throw e;
      }
    },
    [onboard, context, address, wallet],
  );

  return useMemo(() => ({ approveTokenAllowance, loading, error }), [
    approveTokenAllowance,
    loading,
    error,
  ]);
};
