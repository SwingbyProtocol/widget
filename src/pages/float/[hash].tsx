import { SwapDetails as View } from '../../scenes/SwapDetails';
import { GlobalStyles } from '../../modules/styles';
import { SdkContextProvider } from '../../modules/sdk-context';

export default function SwapDetails() {
  return (
    <SdkContextProvider mode="production">
      <GlobalStyles />
      <View />
    </SdkContextProvider>
  );
}
