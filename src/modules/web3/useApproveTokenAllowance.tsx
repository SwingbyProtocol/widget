import { useCallback, useMemo, useState } from 'react';
import { CONTRACTS, getChainFor, SkybridgeCoin } from '@swingby-protocol/sdk';
import { Big } from 'big.js';
import Web3 from 'web3';
import { TransactionConfig } from 'web3-eth';
import { createToast } from '@swingby-protocol/pulsar';
import { Except } from 'type-fest';

import { useSdkContext } from '../store/sdkContext';
import { logger } from '../logger';

import { useOnboard } from './context';
import { watchTransaction } from './watchTransaction';

const isValidCurrency = (coin: any): coin is keyof Except<typeof CONTRACTS.coins, 'BTC'> =>
  ['ethereum', 'binance-smart'].includes(getChainFor({ coin }));

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

        if (!isValidCurrency(currency)) {
          throw new Error(`Invalid "currency": "${currency}"`);
        }

        setLoading(true);
        setError(null);

        if (!(await onboard.walletCheck())) {
          throw new Error('Invalid wallet/network selected');
        }

        const web3 = new Web3(wallet.provider);
        const contract = new web3.eth.Contract(
          CONTRACTS.coins[currency][context.mode].abi,
          CONTRACTS.coins[currency][context.mode].address,
          wallet.provider,
        );

        const decimals = await contract.methods.decimals().call();
        const gasPrice = await web3.eth.getGasPrice();
        const rawTx: TransactionConfig = {
          chain: context.mode === 'production' ? 'mainnet' : 'goerli',
          nonce: await web3.eth.getTransactionCount(address),
          gasPrice: web3.utils.toHex(gasPrice),
          from: address,
          to: CONTRACTS.coins[currency][context.mode].address,
          value: '0x0',
          data: contract.methods
            .approve(spenderAddress, new Big(amount).times(`1e${decimals}`).toFixed())
            .encodeABI(),
        };

        const estimatedGas = await web3.eth.estimateGas(rawTx);
        if (!estimatedGas) {
          logger.warn(rawTx, 'Did not get any value from estimateGas(): %s', estimatedGas);
        } else {
          logger.debug(
            rawTx,
            'Estimated gas that will be spent %s (price: %s ETH)',
            estimatedGas,
            web3.utils.fromWei(gasPrice, 'ether'),
          );
        }

        return watchTransaction(web3.eth.sendTransaction({ ...rawTx, gas: estimatedGas }))
          .on('error', (error) => {
            setLoading(false);
            setError(error);
          })
          .on('receipt', () => {
            setLoading(false);
          });
      } catch (e) {
        setLoading(false);
        setError(e);

        logger.error(e, 'Something went wrong trying to send the approval transaction');
        if (e?.message) {
          createToast({ content: e?.message, type: 'danger' });
        }

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
