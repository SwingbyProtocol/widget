import { SwapProgress, Text } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { Space } from '../../../../../components/Space';
import { useWidgetLayout } from '../../../../layout';

import { Container, ProgressContainer } from './styled';

export const StepIndicator = ({
  status,
}: Pick<React.ComponentPropsWithoutRef<typeof SwapProgress>, 'status'>) => {
  const { currencyIn, currencyOut } = useSelector((state) => state.swap);
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
