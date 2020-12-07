import { useWidgetLayout } from '../../modules/layout';
import { WidgetContainer } from '../../components/WidgetContainer';
import { ModeWarning } from '../../components/ModeWarning';
import { HeadTitle } from '../../components/HeadTitle';
import { Favicon } from '../../components/Favicon';

import { Banner } from './Banner';
import { Vertical } from './Vertical';

export const SwapForm = () => {
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
