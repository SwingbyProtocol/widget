import { useWidgetLayout } from '../../modules/layout';
import { WidgetContainer } from '../../components/WidgetContainer';
import { ModeWarning } from '../../components/ModeWarning';

import { Banner } from './Banner';
import { Vertical } from './Vertical';

export const SwapForm = () => {
  const layout = useWidgetLayout();
  return (
    <>
      <ModeWarning />
      <WidgetContainer>{layout === 'widget-banner' ? <Banner /> : <Vertical />}</WidgetContainer>
    </>
  );
};
