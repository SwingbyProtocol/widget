import { AppProps } from 'next/app';
import { PulsarGlobalStyles, PulsarThemeProvider } from '@swingby-protocol/pulsar';
import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import Head from 'next/head';

import { languages } from '../modules/i18n';
import { WidgetLayoutProvider } from '../modules/layout';
import { useStore } from '../modules/store';
import { Favicon } from '../components/Favicon';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const store = useStore();
  const defaultLocale = router.defaultLocale ?? 'en';
  const locale = router.locale ?? defaultLocale;
  const theme =
    router.query.theme === 'light' ? 'light' : router.query.theme === 'dark' ? 'dark' : undefined;

  return (
    <PulsarThemeProvider theme={theme}>
      <IntlProvider messages={languages.en} locale={locale} defaultLocale={defaultLocale}>
        <PulsarGlobalStyles />
        <ReduxProvider store={store}>
          <WidgetLayoutProvider>
            <Favicon />
            <Head>
              <title>{languages.en['widget.tab-title.generic']}</title>
            </Head>
            <Component {...pageProps} />
          </WidgetLayoutProvider>
        </ReduxProvider>
      </IntlProvider>
    </PulsarThemeProvider>
  );
}

export default MyApp;
