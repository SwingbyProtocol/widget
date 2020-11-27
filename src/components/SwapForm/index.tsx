import { useWidgetLayout } from '../../modules/layout';
import { SwapContainer } from '../SwapContainer';

import { Banner } from './Banner';
import { Vertical } from './Vertical';

export const SwapForm = () => {
  const layout = useWidgetLayout();
  return <SwapContainer>{layout === 'widget-banner' ? <Banner /> : <Vertical />}</SwapContainer>;
};
