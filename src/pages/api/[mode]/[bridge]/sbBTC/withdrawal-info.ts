import { buildContext, getCoinsFor } from '@swingby-protocol/sdk';
import { Big } from 'big.js';
import { StatusCodes } from 'http-status-codes';

import { createEndpoint, getStringParam } from '../../../../../modules/server__api-endpoint';
import { getFees } from '../../../../../modules/server__estimate-fees';
import { calculateSbbtcPrice } from '../../../../../modules/server__sbbtc-price';

type Data = {
  minimumWithdrawalCurrency: string;
  minimumWithdrawal: string;
  isAmountDepositOk: boolean;
};

export default createEndpoint<Data>({
  logId: 'sbbtc-withdrawal-info',
  fn: async ({ req, res, mode, bridge }) => {
    const amountDeposit = getStringParam({ req, name: 'amountDeposit', from: 'query' });
    const currencyReceiving = getStringParam({
      req,
      name: 'currencyReceiving',
      from: 'query',
      oneOf: getCoinsFor({ context: { mode }, bridge, direction: 'out' }),
    });

    const currencyDeposit = bridge === 'btc_erc' ? 'sbBTC' : 'sbBTC.BEP20';
    const context = await buildContext({ mode });
    const fees = await getFees({
      context,
      currencyReceiving,
      currencyDeposit,
      amountDeposit,
    });

    const sbbtcPrice = await calculateSbbtcPrice({ mode, bridge });

    const minimumWithdrawal = new Big(fees.feeMiner)
      .div(new Big(sbbtcPrice).times(new Big(1).minus('0.002')))
      .toFixed(8);

    res.status(StatusCodes.OK).json({
      minimumWithdrawalCurrency: currencyReceiving,
      minimumWithdrawal,
      isAmountDepositOk: new Big(amountDeposit).gte(minimumWithdrawal),
    });
  },
});
