import { GetServerSideProps } from 'next';
import { stringifyUrl } from 'query-string';

export default function Index() {
  return <></>;
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { locale, mode, resource, hashOrNew, ...queryRest } = (() => {
    return {
      ...context.query,
      locale:
        typeof context.query.locale === 'string' && context.locales?.includes(context.query.locale)
          ? context.query.locale
          : context.locale ?? context.defaultLocale ?? 'en',
      mode: context.query.mode === 'test' ? 'test' : 'production',
      resource:
        context.query.resource === 'pool'
          ? 'pool'
          : context.query.resource === 'withdrawal'
          ? 'withdrawal'
          : 'swap',
      hashOrNew:
        typeof context.query.hash === 'string' && context.query.hash ? context.query.hash : 'new',
    };
  })();

  return {
    redirect: {
      permanent: false,
      destination: stringifyUrl({
        url: `/${locale}/${mode}/${resource}/${hashOrNew}`,
        query: queryRest as any,
      }),
    },
  };
};
