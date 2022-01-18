import { buildContext, getBridgeFor, getCoinsFor, SkybridgeCoin } from '@swingby-protocol/sdk';
import { StatusCodes } from 'http-status-codes';

import { createEndpoint, getStringParam } from '../../../modules/server__api-endpoint';
import { getFees } from '../../../modules/server__estimate-fees';

type Data = {
  feeBridgeFraction: string;
  feeCurrency: string;
  feeMiner: string;
};

export default createEndpoint<Data>({
  logId: 'fees',
  fn: async ({ req, res, mode }) => {
    const amountDeposit = getStringParam({ req, name: 'amountDeposit', from: 'query' });
    const currencyDeposit = getStringParam({
      req,
      name: 'currencyDeposit',
      from: 'query',
      oneOf: getCoinsFor({ context: { mode }, direction: 'in' }),
    });
    const currencyReceiving = getStringParam({
      req,
      name: 'currencyReceiving',
      from: 'query',
      oneOf: getCoinsFor({ context: { mode }, direction: 'out' }),
    }) as SkybridgeCoin;

    const context = await buildContext({ mode });
    getBridgeFor({ context, currencyDeposit, currencyReceiving });

    res
      .status(StatusCodes.OK)
      .json(await getFees({ context, currencyReceiving, currencyDeposit, amountDeposit }));
  },
});
