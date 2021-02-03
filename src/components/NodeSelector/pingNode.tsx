import { fetch } from '../../modules/fetch';
import { logger } from '../../modules/logger';

export const pingNode = async (node: string) => {
  try {
    const startedAt = Date.now();
    const result = await fetch(`${node}/api/v1/status`);
    if (!result.ok) {
      throw new Error(`Failed to ping node: ${result.status}: ${result.response}`);
    }

    const finishedAt = Date.now();
    return finishedAt - startedAt;
  } catch (e) {
    logger.warn(e, 'Failed to ping node');
    return null;
  }
};
