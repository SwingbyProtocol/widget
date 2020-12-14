import { SwapForm } from '../../../scenes/SwapForm';
import { GlobalStyles } from '../../../modules/styles';
import { SdkContextProvider } from '../../../modules/sdk-context';

export default function WithdrawNewTest() {
  return (
    <SdkContextProvider mode="test">
      <GlobalStyles />
      <SwapForm action="withdraw" />
    </SdkContextProvider>
  );
}
