import type { TransactionReceipt } from 'web3-eth';
import type { PromiEvent } from 'web3-core';
import { createOrUpdateToast, updateToast } from '@swingby-protocol/pulsar';
import { SkybridgeCoin } from '@swingby-protocol/sdk';

import { logger } from '../../logger';

import { TransferToast } from './TransferToast';

type WatchTransactionProps = {
  coin: SkybridgeCoin;
  tx: PromiEvent<TransactionReceipt>;
  onReceipt: (receipt: TransactionReceipt) => void;
  onTxHash: (txHash: string) => void;
  onError: (error: Error) => void;
};

export const watchTransaction = ({
  coin,
  tx,
  onError,
  onReceipt,
  onTxHash,
}: WatchTransactionProps) => {
  let transactionHash: string | null = null;

  tx.on('transactionHash', (hash) => {
    transactionHash = hash;

    createOrUpdateToast({
      content: <TransferToast transactionId={hash} coin={coin} />,
      type: 'default',
      toastId: 'transaction-result',
    });
    onTxHash(transactionHash);
  })
    .on('confirmation', (confirmations) => {
      updateToast({
        content: (
          <TransferToast
            transactionId={transactionHash}
            confirmations={confirmations}
            coin={coin}
          />
        ),
        type: 'success',
        toastId: 'transaction-result',
      });
    })
    .on('error', (error) => {
      logger.error(error);
      createOrUpdateToast({
        content: <TransferToast error={error} coin={coin} />,
        type: 'danger',
        toastId: 'transaction-result',
      });
      onError(error);
    })
    .on('receipt', (receipt) => {
      createOrUpdateToast({
        content: (
          <TransferToast
            transactionId={transactionHash}
            transactionStatus={receipt.status}
            coin={coin}
          />
        ),
        type: receipt.status ? 'success' : 'danger',
        toastId: 'transaction-result',
      });
      onReceipt(receipt);
    });

  return tx;
};
