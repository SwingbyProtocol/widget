import { Loading, useBuildTestId } from '@swingby-protocol/pulsar';
import { useRouter } from 'next/router';

import { StepIndicator } from '../../../components/StepIndicator';
import { VerticalWidgetView } from '../../../components/VerticalWidgetView';
import { WidgetVerticalContainer } from '../../../components/WidgetVerticalContainer';
import { useSwapDetails } from '../../useSwapDetails';

import { Top } from './Top';

export const Vertical = () => {
  const { buildTestId } = useBuildTestId({ id: 'vertical.swap-details' });
  const { swap } = useSwapDetails();
  const { push } = useRouter();

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
    </WidgetVerticalContainer>
  );
};
