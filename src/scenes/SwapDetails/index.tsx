import { createToast } from '@swingby-protocol/pulsar';
import { SkybridgeResource } from '@swingby-protocol/sdk';
import { useEffect } from 'react';
import { useIntl } from 'react-intl';

import { Favicon } from '../../components/Favicon';
import { HeadTitle } from '../../components/HeadTitle';
import { WidgetContainer } from '../../components/WidgetContainer';
import { useDetails } from '../../modules/details';
import { useWidgetLayout } from '../../modules/layout';

import { ConnectWallet } from './ConnectWallet';
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
      content: formatMessage({ id: 'widget.warning-do-not-use-exchange-addresses' }),
      toastId: 'wallet-address-warning',
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
          <>
            {swap?.status === 'WAITING' && <ConnectWallet resource={resource} />}
            <Vertical resource={resource} />
          </>
        )}
      </WidgetContainer>
    </>
  );
};
