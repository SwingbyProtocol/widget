import { createToast } from '@swingby-protocol/pulsar';
import { SkybridgeResource } from '@swingby-protocol/sdk';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';

import { Favicon } from '../../components/Favicon';
import { HeadTitle } from '../../components/HeadTitle';
import { WidgetContainer } from '../../components/WidgetContainer';
import { useDetails } from '../../modules/details';
import { useWidgetLayout } from '../../modules/layout';

import { Banner } from './Banner';
import { Vertical } from './Vertical';

export const SwapDetails = ({ resource }: { resource: SkybridgeResource }) => {
  const layout = useWidgetLayout();
  const { swap } = useDetails({ resource });
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (swap?.status !== 'WAITING') return;
    createToast({
      type: 'warning',
      content: formatMessage({ id: 'widget.warning-do-use-exchange-addresses' }),
    });
  }, [swap?.status, formatMessage]);

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
