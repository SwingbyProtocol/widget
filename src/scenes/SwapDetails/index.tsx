import { Favicon } from '../../components/Favicon';
import { HeadTitle } from '../../components/HeadTitle';
import { ModeWarning } from '../../components/ModeWarning';
import { WidgetContainer } from '../../components/WidgetContainer';
import { useWidgetLayout } from '../../modules/layout';

import { Banner } from './Banner';
import { Vertical } from './Vertical';

export const SwapDetails = () => {
  const layout = useWidgetLayout();
  return (
    <>
      <ModeWarning />
      <HeadTitle />
      <Favicon />
      <WidgetContainer>{layout === 'widget-banner' ? <Banner /> : <Vertical />}</WidgetContainer>
    </>
  );
};
