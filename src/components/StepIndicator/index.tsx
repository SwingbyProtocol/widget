import { SwapProgress, Text } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';

import { Space } from '../Space';
import { useWidgetLayout } from '../../modules/layout';

import { Container, ProgressContainer } from './styled';

export const StepIndicator = ({
  status,
  currencyIn,
  currencyOut,
}: Pick<
  React.ComponentPropsWithoutRef<typeof SwapProgress>,
  'status' | 'currencyIn' | 'currencyOut'
>) => {
  const layout = useWidgetLayout();
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
