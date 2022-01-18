import { SkybridgeBridge, SkybridgeQuery, SkybridgeStatus } from '@swingby-protocol/sdk';
import { DateTime } from 'luxon';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { fetcher } from '../fetch';
import { logger } from '../logger';
import { useWidgetPathParams } from '../path-params';
import { useSdkContext } from '../store/sdkContext';

type Currency = 'BTC' | 'WBTC' | 'sbBTC' | 'BTCB.BEP20' | 'sbBTC.BEP20';

export interface TransactionQuery {
  addressDeposit: string;
  addressReceiving: string;
  amountDeposit: string;
  hash: string;
  amountReceiving: string;
  currencyDeposit: Currency;
  currencyReceiving: Currency;
  timestamp: Date;
  feeCurrency: string;
  feeTotal: string;
  status: SkybridgeStatus;
  txDepositId?: string;
  txReceivingId?: string;
  isSkypoolsSwap: boolean;
}

const castCurrency = ({
  currency,
  bridge,
}: {
  currency: string;
  bridge: SkybridgeBridge;
}): Currency => {
  switch (currency) {
    case 'BTCB':
      return 'BTCB.BEP20';
    case 'sbBTC':
      return bridge === 'btc_erc' ? 'sbBTC' : 'sbBTC.BEP20';
    case 'SKYPOOL':
      return bridge === 'btc_erc' ? 'WBTC' : 'BTCB.BEP20';

    default:
      return currency as Currency;
  }
};

export const useDetails = () => {
  const { hash: hashParam } = useWidgetPathParams();
  const hash = hashParam ?? '';
  const context = useSdkContext();
  const { query } = useRouter();
  const resource = query.resource;
  const bridge = query.bridge as SkybridgeBridge;
  const baseEndpoint = `${context.servers.swapNode[bridge]}/api/v1`;
  const [swap, setSwap] = useState<TransactionQuery | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchDetail = useCallback(async () => {
    if (!bridge || !hash || !resource || !baseEndpoint) return;
    try {
      setLoading(true);
      const url = `${baseEndpoint}/${resource === 'swap' ? 'swaps' : 'floats'}/query?hash=${hash}`;
      const result = await fetcher<{ items: SkybridgeQuery[] }>(url);
      const data = result.items[0] ?? null;
      if (!data) return;

      const formattedData = {
        addressDeposit: data.addressDeposit,
        addressReceiving: data.addressOut,
        amountDeposit: data.amountIn,
        hash: data.hash,
        amountReceiving: data.amountOut,
        currencyDeposit: castCurrency({ bridge, currency: data.currencyIn }),
        currencyReceiving: castCurrency({ bridge, currency: data.currencyOut }),
        timestamp: DateTime.fromMillis(data.timestamp * 1000).toJSDate(),
        feeCurrency: castCurrency({ bridge, currency: data.feeCurrency }),
        feeTotal: data.fee,
        status: data.status,
        txDepositId: data.txIdIn,
        txReceivingId: data.txIdOut,
        isSkypoolsSwap: data.skypools,
      };
      setSwap(formattedData);
    } catch (error: any) {
      logger.error(error);
      setSwap(null);
    } finally {
      setLoading(false);
    }
  }, [bridge, baseEndpoint, resource, hash]);

  useEffect(() => {
    fetchDetail();
    const interval = setInterval(() => {
      fetchDetail();
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchDetail]);

  return useMemo(() => ({ swap: swap ?? null, loading }), [swap, loading]);
};
