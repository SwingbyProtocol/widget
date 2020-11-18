import { useSelector } from 'react-redux';
import { useBuildTestId } from '@swingby-protocol/pulsar';

import { SwapContainer } from './styled';
import { Form } from './Form';
import { SendTo } from './SendTo';

export const Vertical = () => {
  const { buildTestId } = useBuildTestId({ id: 'vertical' });
  const step = useSelector((state) => state.pagination.step);
  return (
    <SwapContainer>
      {step === 'step-submitted' && <SendTo data-testid={buildTestId(step)} />}
      {(step === 'step-amounts' || step === 'step-address') && (
        <Form data-testid={buildTestId(step)} />
      )}
    </SwapContainer>
  );
};
