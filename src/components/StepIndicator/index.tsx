import { SwapProgress, Text } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';
import { DefaultRootState } from 'react-redux';

import { Space } from '../Space';
import { useWidgetLayout } from '../../modules/layout';

import { Container, ProgressContainer } from './styled';

export const StepIndicator = ({
  status: statusParam,
  currencyIn,
  currencyOut,
}: Pick<React.ComponentPropsWithoutRef<typeof SwapProgress>, 'currencyIn' | 'currencyOut'> & {
  status: NonNullable<DefaultRootState['swaps'][string]>['status'];
}) => {
  const layout = useWidgetLayout();
  const status = ((): React.ComponentPropsWithoutRef<typeof SwapProgress>['status'] => {
    switch (statusParam) {
      case 'waiting':
        return 'waiting';
      case 'pending':
      case 'signing':
      case 'signing-refund':
        return 'pending';
      case 'sending':
      case 'sending-refund':
        return 'sending';
      case 'completed':
      case 'refunded':
        return 'completed';
    }
  })();
  return (
    <Container>
      {(layout === 'widget-full' || layout === 'website') && (
        <>
          <Text variant="accent">
            <FormattedMessage id={`widget.status-message.${status}`} />
          </Text>
          <Space size="street" />
        </>
      )}
      <ProgressContainer>
        <SwapProgress status={status} currencyIn={currencyIn} currencyOut={currencyOut} />
      </ProgressContainer>
    </Container>
  );
};
