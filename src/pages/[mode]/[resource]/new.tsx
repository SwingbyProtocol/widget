import { SwapForm } from '../../../scenes/SwapForm';
import { GlobalStyles } from '../../../modules/styles';
import { SdkContextProvider } from '../../../modules/sdk-context';
import { useWidgetPathParams } from '../../../modules/path-params';

export default function ResourceNew() {
  const { resource, mode } = useWidgetPathParams();
  if (!mode) return <></>;
  if (!resource) return <></>;

  return (
    <SdkContextProvider mode={mode}>
      <GlobalStyles />
      <SwapForm resource={resource} />
    </SdkContextProvider>
  );
}
