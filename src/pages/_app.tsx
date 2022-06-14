import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import {
  PulsarGlobalStyles,
  PulsarThemeProvider,
  PulsarToastContainer,
  PULSAR_GLOBAL_FONT_HREF,
} from '@swingby-protocol/pulsar';
import { isSkybridgeMode } from '@swingby-protocol/sdk';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { useMemo } from 'react';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';

import { Favicon } from '../components/Favicon';
import { graphQlEndpoint } from '../modules/env';
import { languages } from '../modules/i18n';
import { WidgetLayoutProvider } from '../modules/layout';
import { initialStore } from '../modules/store';
import { SdkContextGateKeeper } from '../modules/store/sdkContext';
import { GlobalStyles } from '../modules/styles';
import { OnboardGlobalStyles, OnboardProvider } from '../modules/web3';

const App = ({ Component, pageProps, router }: AppProps) => {
  const apolloClient = new ApolloClient({
    uri: graphQlEndpoint,
    cache: new InMemoryCache(),
  });

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
    <ApolloProvider client={apolloClient}>
      <PulsarThemeProvider theme={theme}>
        <IntlProvider messages={messages} locale={locale} defaultLocale={defaultLocale}>
          <PulsarGlobalStyles />
          <GlobalStyles />
          <OnboardGlobalStyles />
          <ReduxProvider store={initialStore}>
            <SdkContextGateKeeper mode={router.query.mode}>
              <OnboardProvider>
                <WidgetLayoutProvider>
                  <Favicon />
                  <Head>
                    <meta
                      name="viewport"
                      content="width=device-width, initial-scale=1, maximum-scale=1"
                    />
                    <link rel="stylesheet" href={PULSAR_GLOBAL_FONT_HREF} />
                    <title>{messages['widget.tab-title.generic']}</title>
                  </Head>
                  {/* @ts-ignore */}
                  <Component {...pageProps} />
                  <PulsarToastContainer />
                </WidgetLayoutProvider>
              </OnboardProvider>
            </SdkContextGateKeeper>
          </ReduxProvider>
        </IntlProvider>
      </PulsarThemeProvider>
    </ApolloProvider>
  );
};

export default App;
