import { WidgetContainer } from '../../components/WidgetContainer';
import { useWidgetLayout } from '../../modules/layout';

import { Banner } from './Banner';
import { Vertical } from './Vertical';

export const SwapDetails = () => {
  const layout = useWidgetLayout();
  return (
    <WidgetContainer>{layout === 'widget-banner' ? <Banner /> : <Vertical />}</WidgetContainer>
  );
};
