import { StatusCodes } from 'http-status-codes';

import { createEndpoint } from '../../../../../modules/server__api-endpoint';
import { calculateSbbtcPrice } from '../../../../../modules/server__sbbtc-price';

type Data = { price: string };

export default createEndpoint<Data>({
  logId: 'sbbtc-price',
  fn: async ({ res, mode, bridge }) => {
    const price = await calculateSbbtcPrice({ mode, bridge });
    res.status(StatusCodes.OK).json({ price });
  },
});
