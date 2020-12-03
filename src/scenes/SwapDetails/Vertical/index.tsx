import { Loading, useBuildTestId, SwapProgress } from '@swingby-protocol/pulsar';
import { buildExplorerLink } from '@swingby-protocol/sdk';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { VerticalWidgetView } from '../../../components/VerticalWidgetView';
import { WidgetVerticalContainer } from '../../../components/WidgetVerticalContainer';
import { useSdkContext } from '../../../modules/sdk-context';
import { useSwapDetails } from '../../useSwapDetails';

import { ExplorerLink, ExplorerLinkCaret, ProgressContainer } from './styled';
import { Top } from './Top';

export const Vertical = () => {
  const { buildTestId } = useBuildTestId({ id: 'vertical.swap-details' });
  const { swap } = useSwapDetails();
  const { push } = useRouter();
  const { locale } = useIntl();
  const context = useSdkContext();

  const explorerLink = useMemo(() => {
    if (!swap || !swap.transactionOutId) return undefined;
    return buildExplorerLink({
      context,
      coin: swap.currencyOut,
      transactionId: swap.transactionOutId,
    });
  }, [context, swap]);

  if (!swap) {
    return <Loading data-testid={buildTestId('loading')} />;
  }

  return (
    <WidgetVerticalContainer>
      <VerticalWidgetView
        onClickBack={() => push(`${context.mode === 'test' ? '/test' : ''}/swap/new`)}
        top={<Top swap={swap} data-testid={buildTestId('top')} />}
        data-testid={buildTestId('')}
      >
        <ProgressContainer>
          <SwapProgress
            messages={SwapProgress.defaultMessages({ locale })}
            status={swap.status}
            currencyIn={swap.currencyIn}
            currencyOut={swap.currencyOut}
            data-testid={buildTestId('bottom.step-indicator')}
          />
        </ProgressContainer>
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
