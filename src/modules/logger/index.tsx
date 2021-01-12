import pino from 'pino';

import { logLevel } from '../env';

export const logger = pino({ level: logLevel });

(() => {
  try {
    if (typeof window === 'undefined') return;

    const values = (localStorage.getItem('debug') || '').split(',').map((it) => it.trim());
    if (values.includes('*') || values.includes('swingby')) return;

    logger.info(
      `To see the internal logs of the Skybridge SDK, run the following code in your console.\n\n%clocalStorage.debug = 'swingby';`,
      'color: orange;',
    );
  } catch (e) {}
})();
