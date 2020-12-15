import { SwapDetails } from '../../../scenes/SwapDetails';
import { GlobalStyles } from '../../../modules/styles';
import { SdkContextProvider } from '../../../modules/sdk-context';
import { useWidgetPathParams } from '../../../modules/path-params';

export default function ResourceDetails() {
  const { resource, mode } = useWidgetPathParams();
  if (!mode) return <></>;
  if (!resource) return <></>;

  return (
    <SdkContextProvider mode={mode}>
      <GlobalStyles />
      <SwapDetails resource={resource} />
    </SdkContextProvider>
  );
}
