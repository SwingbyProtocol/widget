import { SkybridgeMode, SkybridgeResource, SkybridgeCoin } from '@swingby-protocol/sdk';

import { fetch } from '../fetch';

// Todo: import this function from SDK
export const estimateAmountReceiving = async <M extends SkybridgeMode>({
  context,
  currencyDeposit,
  currencyReceiving,
  amountDesired,
}: any) => {
  const result = await fetch<{
    feeBridgeFraction: string;
    feeCurrency: SkybridgeCoin<SkybridgeResource, M>;
    feeMiner: string;
    feeTotal: string;
    estimatedAmountReceiving: string;
  }>(
    `/api/${context.mode}/fees?currencyDeposit=${currencyDeposit}&currencyReceiving=${currencyReceiving}&amountDeposit=${amountDesired}`,
  );

  if (!result.ok) {
    throw new Error(`${result.status}: ${result.response}`);
  }

  return {
    feeBridgeFraction: result.response.feeBridgeFraction,
    feeCurrency: result.response.feeCurrency,
    feeMiner: result.response.feeMiner,
    feeTotal: result.response.feeTotal,
    amountReceiving: result.response.estimatedAmountReceiving,
  };
};
