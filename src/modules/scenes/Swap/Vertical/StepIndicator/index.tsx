import { Text } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { ProgressIndicator } from '../../../../../components/ProgressIndicator';
import { Space } from '../../../../../components/Space';
import { useWidgetLayout } from '../../../../layout';

import { Container, ProgressContainer } from './styled';

export const StepIndicator = ({
  status,
}: Pick<React.ComponentPropsWithoutRef<typeof ProgressIndicator>, 'status'>) => {
  const { currencyIn, currencyOut } = useSelector((state) => state.form);
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
        <ProgressIndicator status={status} currencyIn={currencyIn} currencyOut={currencyOut} />
      </ProgressContainer>
    </Container>
  );
};
