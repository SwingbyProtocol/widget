import { SwapForm } from '../../../scenes/SwapForm';
import { GlobalStyles } from '../../../modules/styles';
import { SdkContextProvider } from '../../../modules/sdk-context';

export default function FloatNewTest() {
  return (
    <SdkContextProvider mode="test">
      <GlobalStyles />
      <SwapForm />
    </SdkContextProvider>
  );
}
