import { AppProps } from 'next/app';
import { PulsarGlobalStyles, PulsarThemeProvider } from '@swingby-protocol/pulsar';
import { useRouter } from 'next/router';
import { IntlProvider } from 'react-intl';
import { Provider as ReduxProvider } from 'react-redux';
import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getIpInfo, shouldBlockRegion } from '@swingby-protocol/ip-check';

import { en } from '../modules/i18n';
import { WidgetLayoutProvider } from '../modules/layout';
import { useStore } from '../modules/store';
import { Favicon } from '../components/Favicon';
import { IpInfoProvider, IpInfoContextValue } from '../modules/ip-blocks';

type Props = { ipInfo: IpInfoContextValue };

function MyApp({ Component, pageProps, ipInfo }: AppProps & Props) {
  const router = useRouter();
  const store = useStore();
  const defaultLocale = router.defaultLocale ?? 'en';
  const locale = router.locale ?? defaultLocale;
  const theme =
    router.query.theme === 'light' ? 'light' : router.query.theme === 'dark' ? 'dark' : undefined;

  return (
    <IpInfoProvider value={ipInfo}>
      <PulsarThemeProvider theme={theme}>
        <IntlProvider messages={en} locale={locale} defaultLocale={defaultLocale}>
          <PulsarGlobalStyles />
          <ReduxProvider store={store}>
            <WidgetLayoutProvider>
              <Favicon />
              <Head>
                <title>{en['widget.tab-title.generic']}</title>
              </Head>
              <Component {...pageProps} />
            </WidgetLayoutProvider>
          </ReduxProvider>
        </IntlProvider>
      </PulsarThemeProvider>
    </IpInfoProvider>
  );
}

export default MyApp;

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  const clientIp =
    (typeof req.headers['x-real-ip'] === 'string' ? req.headers['x-real-ip'] : undefined) ??
    req.connection.remoteAddress ??
    '';

  const ipInfo = await (async () => {
    try {
      return await getIpInfo({
        ip: clientIp,
        ipstackApiKey: process.env.IPSTACK_API_KEY ?? '',
      });
    } catch (e) {
      return e.message;
    }
  })();

  const blockRegion = (() => {
    try {
      return shouldBlockRegion(ipInfo as any);
    } catch (e) {
      return false;
    }
  })();

  return { props: { ipInfo: { ipInfo, clientIp, blockRegion } } };
};
