import type { TransactionReceipt } from 'web3-eth';
import type { PromiEvent } from 'web3-core';
import { createOrUpdateToast, updateToast } from '@swingby-protocol/pulsar';
import { SkybridgeCoin } from '@swingby-protocol/sdk';

import { logger } from '../../logger';

import { TransferToast } from './TransferToast';

export const watchTransaction = ({
  coin,
  tx,
}: {
  coin: SkybridgeCoin;
  tx: PromiEvent<TransactionReceipt>;
}) => {
  let transactionHash: string | null = null;

  tx.on('transactionHash', (hash) => {
    transactionHash = hash;

    createOrUpdateToast({
      content: <TransferToast transactionId={hash} coin={coin} />,
      type: 'default',
      toastId: 'transaction-result',
    });
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
    });

  return tx;
};
