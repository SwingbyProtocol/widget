import { createToast, Loading } from '@swingby-protocol/pulsar';
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
  const { swap, loading, error } = useDetails();
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (swap?.status !== 'WAITING') return;
    createToast({
      type: 'warning',
      content: formatMessage({ id: 'widget.warning-do-not-use-exchange-addresses' }),
      toastId: 'wallet-address-warning',
    });
  }, [swap?.status, formatMessage]);

  const SwapDetailsElement = () => {
    if (loading) {
      return <Loading />;
    }
    if (error) {
      return <div>Error fetching swap details: {error}</div>;
    }
    if (!swap) {
      return <div>NO SWAP FOUND</div>;
    }
    if (layout === 'widget-banner') {
      return <Banner resource={resource} swap={swap} />;
    }
    return <Vertical resource={resource} />;
  };

  return (
    <>
      <HeadTitle />
      <Favicon />
      <WidgetContainer>
        <SwapDetailsElement />
      </WidgetContainer>
    </>
  );
};
