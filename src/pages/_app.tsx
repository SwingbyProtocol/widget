import { PulsarGlobalStyles } from '@swingby-protocol/pulsar';
import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';

import { en } from '../modules/i18n';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const defaultLocale = router.defaultLocale ?? 'en-US';
  const locale = router.locale ?? defaultLocale;

  return (
    <IntlProvider messages={en} locale={locale} defaultLocale={defaultLocale}>
      <PulsarGlobalStyles />
      <Component {...pageProps} />
    </IntlProvider>
  );
}

export default MyApp;
