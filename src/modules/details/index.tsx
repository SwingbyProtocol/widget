import { DateTime } from 'luxon';
import { useMemo } from 'react';
import { DefaultRootState, useSelector } from 'react-redux';

import { TransactionCurrency, useSwapDetailsQuery } from '../../generated/graphql';
import { useWidgetPathParams } from '../path-params';

const MS_TILL_NEXT_TRY = 10000;

type SwapDetails = { loading: boolean; swap: null | DefaultRootState['swaps'][string] };

const covertGqlCurrency = (
  value: TransactionCurrency,
): NonNullable<DefaultRootState['swaps'][string]>['currencyDeposit'] => {
  switch (value) {
    case TransactionCurrency.Btc:
      return 'BTC';
    case TransactionCurrency.BtcbBep20:
      return 'BTCB.BEP20';
    case TransactionCurrency.SbBtcBep20:
      return 'sbBTC.BEP20';
    case TransactionCurrency.SbBtcErc20:
      return 'sbBTC';
    case TransactionCurrency.WbtcErc20:
      return 'WBTC';
  }
};

export const useDetails = (): SwapDetails => {
  const { hash: hashParam } = useWidgetPathParams();
  const hash = hashParam ?? '';

  const { data, loading } = useSwapDetailsQuery({
    variables: { id: hash },
    pollInterval: MS_TILL_NEXT_TRY,
  });
  const swapRedux = useSelector((state) => state.swaps[hash]);

  const swap: null | DefaultRootState['swaps'][string] = useMemo(() => {
    if (!data) return swapRedux ?? null;
    return {
      addressDeposit: data.transaction.depositAddress,
      addressReceiving: data.transaction.receivingAddress,
      amountDeposit: data.transaction.depositAmount,
      hash: data.transaction.id,
      amountReceiving: data.transaction.receivingAmount,
      currencyDeposit: covertGqlCurrency(data.transaction.depositCurrency),
      currencyReceiving: covertGqlCurrency(data.transaction.receivingCurrency),
      timestamp: DateTime.fromISO(data.transaction.at).toJSDate(),
      feeCurrency: covertGqlCurrency(data.transaction.feeCurrency),
      feeTotal: data.transaction.feeTotal,
      status: data.transaction.status,
      txDepositId: data.transaction.depositTxHash,
      txReceivingId: data.transaction.receivingTxHash,
    };
  }, [data, swapRedux]);

  return useMemo(() => ({ swap: swap ?? null, loading }), [swap, loading]);
};
