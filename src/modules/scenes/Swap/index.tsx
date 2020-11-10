import { useWidgetLayout } from '../../layout';

import { Banner } from './Banner';
import { Vertical } from './Vertical';

export const Swap = () => {
  const layout = useWidgetLayout();

  if (layout === 'widget-banner') {
    return <Banner />;
  }

  return <Vertical />;
};
