import { isSkybridgeBridge, isSkybridgeMode } from '@swingby-protocol/sdk';
import { NextApiRequest, NextApiResponse } from 'next';

import { fetcher } from '../../../../modules/fetch';
import { logger } from '../../../../modules/logger';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const mode = isSkybridgeMode(req.query.mode) ? req.query.mode : null;
    if (!mode) {
      throw new Error(`"mode" param is required`);
    }

    const bridge = isSkybridgeBridge(req.query.bridge) ? req.query.bridge : null;
    if (!bridge) {
      throw new Error(`"bridge" param is required`);
    }

    const endpoint = (() => {
      switch (bridge) {
        case 'btc_erc':
          return 'https://btc-wbtc-mainnet.s3.eu-central-1.amazonaws.com/platform_status.json';
        case 'btc_bep20':
          return 'https://btc-bsc-mainnet.s3-ap-southeast-1.amazonaws.com/platform_status.json';
        default:
          return null;
      }
    })();

    if (endpoint) {
      res.status(200).json(await fetcher(endpoint));
    } else {
      res.status(200).json({ status: 1 });
    }
  } catch (e) {
    logger.error(e, 'Failed to forward to call to affiliate program');
    res.status(500).json({ message: 'Failed to forward to call to affiliate program' });
  }
};
