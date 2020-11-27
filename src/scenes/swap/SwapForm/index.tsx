import { useWidgetLayout } from '../../../modules/layout';
import { WidgetContainer } from '../../../components/WidgetContainer';

import { Banner } from './Banner';
import { Vertical } from './Vertical';

export const SwapForm = () => {
  const layout = useWidgetLayout();
  return (
    <WidgetContainer>{layout === 'widget-banner' ? <Banner /> : <Vertical />}</WidgetContainer>
  );
};
