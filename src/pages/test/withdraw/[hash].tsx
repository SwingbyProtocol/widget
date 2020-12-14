import { SwapDetails } from '../../../scenes/SwapDetails';
import { GlobalStyles } from '../../../modules/styles';
import { SdkContextProvider } from '../../../modules/sdk-context';

export default function WithdrawDetailsTest() {
  return (
    <SdkContextProvider mode="test">
      <GlobalStyles />
      <SwapDetails />
    </SdkContextProvider>
  );
}
