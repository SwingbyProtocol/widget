import { useCallback, useMemo, useState } from 'react';
import { CONTRACTS } from '@swingby-protocol/sdk';
import { Big } from 'big.js';
import type { DefaultRootState } from 'react-redux';
import Web3 from 'web3';
import { TransactionConfig } from 'web3-eth';

import { logger } from '../logger';
import { useSdkContext } from '../store/sdkContext';

import { useOnboard } from './context';
import { watchTransaction } from './watchTransaction';

export const useTransferToken = () => {
  const context = useSdkContext();
  const { onboard, wallet, address } = useOnboard();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const transfer = useCallback(
    async ({ swap }: { swap: null | DefaultRootState['swaps'][string] }) => {
      try {
        if (!onboard) {
          throw new Error('Onboard has not been initialised');
        }

        if (!address || !wallet) {
          throw new Error('No wallet has been connected');
        }

        if (!swap) {
          throw new Error('No swap has been provided');
        }

        if (swap.currencyDeposit !== 'WBTC' && swap.currencyDeposit !== 'sbBTC') {
          throw new Error(`Invalid "currencyDeposit": "${swap.currencyDeposit}"`);
        }

        setLoading(true);
        setError(null);

        const { currencyDeposit, addressDeposit, amountDeposit } = swap;

        await onboard.walletCheck();
        const web3 = new Web3(wallet.provider);
        const contract = new web3.eth.Contract(
          CONTRACTS[currencyDeposit][context.mode].abi,
          CONTRACTS[currencyDeposit][context.mode].address,
          wallet.provider,
        );

        const tokenDecimals = await contract.methods.decimals().call();
        const gasPrice = await web3.eth.getGasPrice();
        const rawTx: TransactionConfig = {
          chain: context.mode === 'production' ? 'mainnet' : 'goerli',
          nonce: await web3.eth.getTransactionCount(address),
          gasPrice: web3.utils.toHex(gasPrice),
          from: address,
          to: CONTRACTS[currencyDeposit][context.mode].address,
          value: '0x0',
          data: contract.methods
            .transfer(
              addressDeposit,
              web3.utils.toHex(new Big(amountDeposit).times(`1e${tokenDecimals}`).toFixed()),
            )
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
        throw e;
      }
    },
    [address, context, onboard, wallet],
  );

  return useMemo(() => ({ loading, error, transfer }), [loading, error, transfer]);
};
