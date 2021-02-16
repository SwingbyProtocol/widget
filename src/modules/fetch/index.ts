import originalFetch from 'isomorphic-unfetch';
import { AbortController as AbortControllerPonyfill } from 'abortcontroller-polyfill/dist/cjs-ponyfill'; // eslint-disable-line import/no-internal-modules

import { logger } from '../logger';

export const AbortController = AbortControllerPonyfill as typeof window.AbortController;

export const fetch = async <
  SuccessResponse extends unknown,
  ErrorResponse extends unknown = string
>(
  url: Parameters<typeof originalFetch>[0],
  optionsParam?: Parameters<typeof originalFetch>[1],
): Promise<
  | { ok: true; status: number; response: SuccessResponse }
  | { ok: false; status: number; response: ErrorResponse }
> => {
  const options: typeof optionsParam = {
    ...optionsParam,
    headers: {
      'Content-Type': 'application/json',
      ...optionsParam?.headers,
    },
  };

  logger.trace(`Will call "%s" with: %O`, url, options);
  const result = await originalFetch(url, options);

  const response = await (async () => {
    const str = await result.text();
    try {
      return JSON.parse(str);
    } catch (e) {
      return str;
    }
  })();

  if (!result.ok) {
    return { ok: false, status: result.status, response: response?.message ?? response };
  }

  return { ok: true, status: result.status, response };
};
