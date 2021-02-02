import { SkybridgeResource } from '@swingby-protocol/sdk';

import { useWidgetLayout } from '../../modules/layout';
import { WidgetContainer } from '../../components/WidgetContainer';
import { HeadTitle } from '../../components/HeadTitle';
import { Favicon } from '../../components/Favicon';
import { useIpInfo } from '../../modules/ip-blocks';
import { IpBlockWarning } from '../../components/IpBlockWarning';
import { NodeSelector } from '../../components/NodeSelector';

import { Banner } from './Banner';
import { Vertical } from './Vertical';

export const SwapForm = ({ resource }: { resource: SkybridgeResource }) => {
  const layout = useWidgetLayout();
  const { shouldBlockRegion } = useIpInfo();
  return (
    <>
      {shouldBlockRegion && <IpBlockWarning />}
      <HeadTitle />
      <Favicon />
      <WidgetContainer>
        {layout === 'widget-banner' ? (
          <Banner resource={resource} />
        ) : (
          <>
            <NodeSelector />
            <Vertical resource={resource} />
          </>
        )}
      </WidgetContainer>
    </>
  );
};
