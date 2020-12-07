import { useWidgetLayout } from '../../modules/layout';
import { WidgetContainer } from '../../components/WidgetContainer';
import { ModeWarning } from '../../components/ModeWarning';
import { HeadTitle } from '../../components/HeadTitle';

import { Banner } from './Banner';
import { Vertical } from './Vertical';

export const SwapForm = () => {
  const layout = useWidgetLayout();
  return (
    <>
      <ModeWarning />
      <HeadTitle />
      <WidgetContainer>{layout === 'widget-banner' ? <Banner /> : <Vertical />}</WidgetContainer>
    </>
  );
};
