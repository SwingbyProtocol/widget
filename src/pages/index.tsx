import Head from 'next/head';
import { useRouter } from 'next/router';
import { parseUrl } from 'query-string';

export default function Index() {
  const router = useRouter();

  const { locale, mode, resource, hashOrNew } = (() => {
    const queryParams = (() => {
      try {
        const { query } = parseUrl(`https://fake.com${router.asPath}`);
        return query;
      } catch (e) {
        return {};
      }
    })();

    return {
      locale:
        typeof queryParams.locale === 'string' && router.locales?.includes(queryParams.locale)
          ? queryParams.locale
          : router.locale ?? router.defaultLocale ?? 'en',
      mode: queryParams.mode === 'test' ? 'test' : 'production',
      resource:
        queryParams.resource === 'pool'
          ? 'pool'
          : queryParams.resource === 'withdrawal'
          ? 'withdrawal'
          : 'swap',
      hashOrNew:
        typeof queryParams.hash === 'string' && queryParams.hash ? queryParams.hash : 'new',
    };
  })();

  return (
    <Head>
      <meta httpEquiv="refresh" content={`0; URL='/${locale}/${mode}/${resource}/${hashOrNew}'`} />
    </Head>
  );
}
