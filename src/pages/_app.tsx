import { PulsarGlobalStyles, PulsarThemeProvider } from '@swingby-protocol/pulsar';
import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';

import { en } from '../modules/i18n';
import { WidgetLayoutProvider } from '../modules/layout';
import { SdkContextProvider } from '../modules/sdk-context';
import { useStore } from '../modules/store';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const store = useStore();
  const defaultLocale = router.defaultLocale ?? 'en-US';
  const locale = router.locale ?? defaultLocale;

  return (
    <PulsarThemeProvider>
      <IntlProvider messages={en} locale={locale} defaultLocale={defaultLocale}>
        <PulsarGlobalStyles />
        <ReduxProvider store={store}>
          <WidgetLayoutProvider>
            <SdkContextProvider>
              <Component {...pageProps} />
            </SdkContextProvider>
          </WidgetLayoutProvider>
        </ReduxProvider>
      </IntlProvider>
    </PulsarThemeProvider>
  );
}

export default MyApp;
