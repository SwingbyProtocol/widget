import { useCallback, useMemo, useState } from 'react';
import { CONTRACTS } from '@swingby-protocol/sdk';
import { Big } from 'big.js';
import type { DefaultRootState } from 'react-redux';
import Web3 from 'web3';
import { TransactionConfig, TransactionReceipt } from 'web3-eth';
import { createToast } from '@swingby-protocol/pulsar';

import { logger } from '../logger';
import { useSdkContext } from '../store/sdkContext';

import { useOnboard } from './context';
import { watchTransaction } from './watchTransaction';
import { isWeb3ableCurrency } from './isWeb3ableCurrency';
import { getTransactionChainProp } from './getTransactionChainProp';

export const useTransferToken = () => {
  const context = useSdkContext();
  const { onboard, wallet, address } = useOnboard();
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
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

        if (!isWeb3ableCurrency(swap.currencyDeposit)) {
          throw new Error(`Invalid "currencyDeposit": "${swap.currencyDeposit}"`);
        }

        setLoading(true);
        setError(null);

        const { currencyDeposit, addressDeposit, amountDeposit } = swap;

        if (!(await onboard.walletCheck())) {
          throw new Error('Invalid wallet/network selected');
        }

        const web3 = new Web3(wallet.provider);
        const contract = new web3.eth.Contract(
          CONTRACTS.coins[currencyDeposit][context.mode].abi,
          CONTRACTS.coins[currencyDeposit][context.mode].address,
          wallet.provider,
        );

        const tokenDecimals = await contract.methods.decimals().call();
        const gasPrice = await web3.eth.getGasPrice();
        const rawTx: TransactionConfig = {
          chain: getTransactionChainProp({ mode: context.mode, coin: currencyDeposit }),
          nonce: await web3.eth.getTransactionCount(address),
          gasPrice: web3.utils.toHex(gasPrice),
          from: address,
          to: CONTRACTS.coins[currencyDeposit][context.mode].address,
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

        return await watchTransaction({
          coin: swap.currencyDeposit,
          tx: web3.eth.sendTransaction({ ...rawTx, gas: estimatedGas }),
          onReceipt: (receipt: TransactionReceipt) => setLoading(false),
          onError: (error: Error) => {
            setLoading(false);
            setError(error);
          },
          onTxHash: (transactionHash: string) => setTxHash(transactionHash),
        });
      } catch (err: any) {
        setLoading(false);
        setError(err);

        logger.error({ err }, 'Something went wrong trying to send the transaction');
        if (err?.message) {
          createToast({ content: err?.message, type: 'danger' });
        }

        throw err;
      }
    },
    [address, context, onboard, wallet],
  );

  return useMemo(() => ({ loading, error, transfer, txHash }), [loading, error, transfer, txHash]);
};
