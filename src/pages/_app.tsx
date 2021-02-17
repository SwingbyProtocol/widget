import { AppProps } from 'next/app';
import {
  PulsarGlobalStyles,
  PulsarThemeProvider,
  PULSAR_GLOBAL_FONT_HREF,
  PulsarToastContainer,
} from '@swingby-protocol/pulsar';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import Head from 'next/head';
import { useMemo } from 'react';
import { isSkybridgeMode } from '@swingby-protocol/sdk';

import { languages } from '../modules/i18n';
import { WidgetLayoutProvider } from '../modules/layout';
import { useStore } from '../modules/store';
import { Favicon } from '../components/Favicon';
import { GlobalStyles } from '../modules/styles';
import { SdkContextGateKeeper } from '../modules/store/sdkContext';
import { OnboardProvider, OnboardGlobalStyles } from '../modules/web3';

function MyApp({ Component, pageProps, router }: AppProps) {
  const store = useStore();
  const defaultLocale = router.defaultLocale ?? 'en';
  const locale = (() => {
    const result = router.locale ?? defaultLocale;
    if (Object.keys(languages).includes(result)) {
      return result as keyof typeof languages;
    }

    return 'en';
  })();
  const theme =
    router.query.theme === 'light' ? 'light' : router.query.theme === 'dark' ? 'dark' : undefined;

  const messages = useMemo(() => ({ ...languages.en, ...languages[locale] }), [locale]);

  if (!isSkybridgeMode(router.query.mode)) {
    return <>{null}</>;
  }

  return (
    <PulsarThemeProvider theme={theme}>
      <IntlProvider messages={messages} locale={locale} defaultLocale={defaultLocale}>
        <PulsarGlobalStyles />
        <GlobalStyles />
        <OnboardGlobalStyles />
        <ReduxProvider store={store}>
          <SdkContextGateKeeper mode={router.query.mode}>
            <OnboardProvider>
              <WidgetLayoutProvider>
                <Favicon />
                <Head>
                  <link rel="stylesheet" href={PULSAR_GLOBAL_FONT_HREF} />
                  <title>{messages['widget.tab-title.generic']}</title>
                </Head>
                <Component {...pageProps} />
                <PulsarToastContainer />
              </WidgetLayoutProvider>
            </OnboardProvider>
          </SdkContextGateKeeper>
        </ReduxProvider>
      </IntlProvider>
    </PulsarThemeProvider>
  );
}

export default MyApp;
