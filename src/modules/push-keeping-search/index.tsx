import { useRouter } from 'next/router';
import { parseUrl, stringifyUrl } from 'query-string';
import { useMemo } from 'react';

export const usePushWithSearchParams = () => {
  const { push, asPath } = useRouter();
  return useMemo(
    () => ({
      push: (url: string) => {
        const search = (() => {
          try {
            const { query } = parseUrl(asPath);
            return query;
          } catch (err) {
            return {};
          }
        })();

        push(stringifyUrl({ url, query: search }));
      },
    }),
    [push, asPath],
  );
};
