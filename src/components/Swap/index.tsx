import { useWidgetLayout } from '../../modules/layout';

import { Banner } from './Banner';
import { RootLayout } from './RootLayout';
import { Vertical } from './Vertical';

export const Swap = () => {
  const layout = useWidgetLayout();
  return <RootLayout>{layout === 'widget-banner' ? <Banner /> : <Vertical />}</RootLayout>;
};
