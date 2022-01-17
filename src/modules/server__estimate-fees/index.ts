import {
  CONTRACTS,
  SkybridgeCoin,
  getBridgeFor,
  SkybridgeContext,
  SkybridgeBridge,
  FIXED_NODE_ENDPOINT,
} from '@swingby-protocol/sdk';
import fetch from 'isomorphic-unfetch';
import { Big } from 'big.js';
import { ethers } from 'ethers';

import { calculateSbbtcPrice } from '../server__sbbtc-price';
import { buildWeb3Instance } from '../server__web3';

const SBBTC_REG_EXP = /^sbBTC(\.[A-Z0-9]+)?$/;

export const getFees = async ({
  context,
  amountDeposit,
  currencyDeposit,
  currencyReceiving,
}: {
  context: SkybridgeContext;
  amountDeposit: string;
  currencyDeposit: SkybridgeCoin;
  currencyReceiving: SkybridgeCoin;
}): Promise<{
  feeBridgeFraction: string;
  feeCurrency: string;
  feeMiner: string;
  feeTotal: string;
  estimatedAmountReceiving: Big;
}> => {
  const fees = await getSwapFees({ context, currencyReceiving, currencyDeposit });
  const bridge = getBridgeFor({ context, currencyReceiving, currencyDeposit });

  if (SBBTC_REG_EXP.test(currencyReceiving)) {
    fees.feeBridgeFraction = await (
      await getPoolFees({ context, bridge, amountDeposit, currencyDeposit })
    ).toNumber();
    fees.feeMiner = 0;
  }

  if (SBBTC_REG_EXP.test(currencyDeposit)) {
    fees.feeBridgeFraction = await (await getWithdrawalFees({ context, bridge })).toNumber();
  }

  const feeTotal = new Big(amountDeposit)
    .times(fees.feeBridgeFraction)
    .plus(fees.feeMiner)
    .toNumber();
  return {
    ...fees,
    feeBridgeFraction: Number(fees.feeBridgeFraction.toFixed(5)).toString(),
    feeMiner: Number(fees.feeMiner.toFixed(5)).toString(),
    feeTotal: Number(feeTotal.toFixed(5)).toString(),
    estimatedAmountReceiving: await (async () => {
      const result = new Big(amountDeposit).minus(feeTotal);
      if (!/^sbBTC/.test(currencyDeposit)) {
        return result;
      }

      const sbBtcPrice = await calculateSbbtcPrice({ mode: context.mode, bridge });
      return new Big(result).times(sbBtcPrice);
    })(),
  };
};

const getSwapFees = async ({
  context,
  currencyDeposit,
  currencyReceiving,
}: {
  context: SkybridgeContext;
  currencyDeposit: SkybridgeCoin;
  currencyReceiving: SkybridgeCoin;
}): Promise<{
  feeBridgeFraction: number;
  feeCurrency: string;
  feeMiner: number;
}> => {
  const bridge = getBridgeFor({ context, currencyDeposit, currencyReceiving });

  // Todo: remove unhealthy node
  // const base = context.servers.swapNode[bridge];
  const base = FIXED_NODE_ENDPOINT[bridge][context.mode][0];

  const endpoint = `${base}/api/v1/swaps/fees`;
  const response = await (async () => {
    try {
      const result = await fetch(endpoint);
      if (!result.ok) {
        throw new Error();
      }

      return (await result.json()) as Array<{
        bridgeFeePercent: string;
        currency: string;
        minerFee: string;
      }>;
    } catch (e) {
      throw new Error(`Could not get a response from "${endpoint}"`);
    }
  })();

  const item = response.find((it) => it.currency === currencyReceiving.replace(/\.[A-Z0-9]+$/, ''));
  if (!item) {
    throw new Error(`Could not get fee info for "${currencyReceiving}"`);
  }

  return {
    feeBridgeFraction: new Big(item.bridgeFeePercent).div(100).toNumber(),
    feeCurrency: currencyReceiving,
    feeMiner: new Big(item.minerFee).div('1e8').toNumber(),
  };
};

const getPoolFees = async ({
  amountDeposit,
  currencyDeposit,
  context,
  bridge,
}: {
  amountDeposit: string;
  bridge: SkybridgeBridge;
  currencyDeposit: SkybridgeCoin;
  context: SkybridgeContext;
}): Promise<Big> => {
  const web3 = buildWeb3Instance({ mode: context.mode, bridge });
  const contract = new web3.eth.Contract(
    CONTRACTS.bridges[bridge][context.mode].abi,
    CONTRACTS.bridges[bridge][context.mode].address,
  );

  return new Big(
    await contract.methods
      .getDepositFeeRate(
        CONTRACTS.coins[currencyDeposit as keyof typeof CONTRACTS['coins']][context.mode].address,
        ethers.utils.parseUnits(amountDeposit, 8),
      )
      .call(),
  ).div(10000);
};

const getWithdrawalFees = async ({
  context,
  bridge,
}: {
  context: SkybridgeContext;
  bridge: SkybridgeBridge;
}): Promise<Big> => {
  const web3 = buildWeb3Instance({ mode: context.mode, bridge });
  const contract = new web3.eth.Contract(
    CONTRACTS.bridges[bridge][context.mode].abi,
    CONTRACTS.bridges[bridge][context.mode].address,
  );

  return new Big(await contract.methods.withdrawalFeeBPS().call()).div(10000);
};
