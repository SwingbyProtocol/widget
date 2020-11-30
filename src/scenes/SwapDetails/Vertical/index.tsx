import { Loading, useBuildTestId } from '@swingby-protocol/pulsar';
import { buildExplorerLink } from '@swingby-protocol/sdk';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { StepIndicator } from '../../../components/StepIndicator';
import { VerticalWidgetView } from '../../../components/VerticalWidgetView';
import { WidgetVerticalContainer } from '../../../components/WidgetVerticalContainer';
import { useSdkContext } from '../../../modules/sdk-context';
import { useSwapDetails } from '../../useSwapDetails';

import { ExplorerLink, ExplorerLinkCaret } from './styled';
import { Top } from './Top';

export const Vertical = () => {
  const { buildTestId } = useBuildTestId({ id: 'vertical.swap-details' });
  const { swap } = useSwapDetails();
  const { push } = useRouter();
  const context = useSdkContext();

  const explorerLink = useMemo(() => {
    if (!swap || !swap.transactionOutId) return undefined;
    return buildExplorerLink({
      context,
      currency: swap.currencyOut,
      transactionId: swap.transactionOutId,
    });
  }, [context, swap]);

  if (!swap) {
    return <Loading data-testid={buildTestId('loading')} />;
  }

  return (
    <WidgetVerticalContainer>
      <VerticalWidgetView
        onClickBack={() => push('/swap/new')}
        top={<Top swap={swap} data-testid={buildTestId('top')} />}
        data-testid={buildTestId('')}
      >
        <StepIndicator
          status={swap.status}
          currencyIn={swap.currencyIn}
          currencyOut={swap.currencyOut}
          data-testid={buildTestId('bottom.step-indicator')}
        />
      </VerticalWidgetView>
      {explorerLink && (
        <ExplorerLink
          href={explorerLink}
          target="_blank"
          data-testid={buildTestId('explorer-link')}
        >
          <FormattedMessage id="widget.explorer-link-long" />
          <ExplorerLinkCaret />
        </ExplorerLink>
      )}
    </WidgetVerticalContainer>
  );
};
