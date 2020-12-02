import { SwapForm } from '../../scenes/SwapForm';
import { GlobalStyles } from '../../modules/styles';
import { SdkContextProvider } from '../../modules/sdk-context';

export default function SwapNew() {
  return (
    <SdkContextProvider mode="production">
      <GlobalStyles />
      <SwapForm />
    </SdkContextProvider>
  );
}
