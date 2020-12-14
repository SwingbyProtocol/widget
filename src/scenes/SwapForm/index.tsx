import { useWidgetLayout } from '../../modules/layout';
import { WidgetContainer } from '../../components/WidgetContainer';
import { ModeWarning } from '../../components/ModeWarning';
import { HeadTitle } from '../../components/HeadTitle';
import { Favicon } from '../../components/Favicon';
import { WidgetActionProp } from '../../modules/widget-action';

import { Banner } from './Banner';
import { Vertical } from './Vertical';

export const SwapForm = ({ action }: WidgetActionProp) => {
  const layout = useWidgetLayout();
  return (
    <>
      <ModeWarning />
      <HeadTitle />
      <Favicon />
      <WidgetContainer>
        {layout === 'widget-banner' ? <Banner action={action} /> : <Vertical action={action} />}
      </WidgetContainer>
    </>
  );
};
