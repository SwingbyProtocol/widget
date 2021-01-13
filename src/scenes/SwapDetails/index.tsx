import { SkybridgeResource } from '@swingby-protocol/sdk';

import { Favicon } from '../../components/Favicon';
import { HeadTitle } from '../../components/HeadTitle';
import { WidgetContainer } from '../../components/WidgetContainer';
import { useWidgetLayout } from '../../modules/layout';

import { Banner } from './Banner';
import { Vertical } from './Vertical';

export const SwapDetails = ({ resource }: { resource: SkybridgeResource }) => {
  const layout = useWidgetLayout();
  return (
    <>
      <HeadTitle />
      <Favicon />
      <WidgetContainer>
        {layout === 'widget-banner' ? (
          <Banner resource={resource} />
        ) : (
          <Vertical resource={resource} />
        )}
      </WidgetContainer>
    </>
  );
};
