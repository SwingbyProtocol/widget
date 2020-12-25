import { SkybridgeResource } from '@swingby-protocol/sdk';

import { useWidgetLayout } from '../../modules/layout';
import { WidgetContainer } from '../../components/WidgetContainer';
import { ModeWarning } from '../../components/ModeWarning';
import { HeadTitle } from '../../components/HeadTitle';
import { Favicon } from '../../components/Favicon';
import { useIpInfo } from '../../modules/ip-blocks';
import { IpBlockWarning } from '../../components/IpBlockWarning';

import { Banner } from './Banner';
import { Vertical } from './Vertical';

export const SwapForm = ({ resource }: { resource: SkybridgeResource }) => {
  const layout = useWidgetLayout();
  const { blockRegion } = useIpInfo();
  return (
    <>
      {blockRegion && <IpBlockWarning />}
      <ModeWarning />
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
