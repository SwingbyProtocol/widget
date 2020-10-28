import { PulsarGlobalStyles } from '@swingby-protocol/pulsar';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <PulsarGlobalStyles />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
