import { SwapDetails } from '../../../scenes/SwapDetails';
import { useWidgetPathParams } from '../../../modules/path-params';

export default function ResourceDetails() {
  const { resource } = useWidgetPathParams();
  if (!resource) return <></>;

  return <SwapDetails resource={resource} />;
}
