import { Swap } from '../modules/swap';
import { RootLayout } from '../components/RootLayout';
import { GlobalStyles } from '../modules/styles';

export default function Home() {
  return (
    <>
      <GlobalStyles />
      <RootLayout>
        <Swap />
      </RootLayout>
    </>
  );
}
