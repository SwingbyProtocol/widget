import { NextApiRequest, NextApiResponse } from 'next';

import { fetch } from '../../../../modules/fetch';
import { logger } from '../../../../modules/logger';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      throw new Error(`"${req.method}" is not allowed. Must use "POST".`);
    }

    const result = await fetch(
      `https://affiliate.swingby.network/api/${req.query.mode}/swaps/link`,
      {
        method: 'POST',
        body: JSON.stringify(req.body),
      },
    );

    if (result.ok) {
      res.status(result.status).json(result.response);
    } else {
      res.status(result.status).json({ message: result.response });
    }
  } catch (err) {
    logger.error({ err }, 'Failed to forward to call to affiliate program');
    res.status(500).json({ message: 'Failed to forward to call to affiliate program' });
  }
};
