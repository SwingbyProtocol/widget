import { useState } from 'react';
import { useBuildTestId } from '@swingby-protocol/pulsar';

import { SwapContainer } from './styled';
import { Form } from './Form';
import { SendTo } from './SendTo';

export const Vertical = () => {
  const { buildTestId } = useBuildTestId({ id: 'vertical' });
  const [step, setStep] = useState<'form' | 'send-to'>('form');
  return (
    <SwapContainer>
      {step === 'send-to' && (
        <SendTo onClickBack={() => setStep('form')} data-testid={buildTestId('send-to')} />
      )}
      {step === 'form' && (
        <Form onClickSwap={() => setStep('send-to')} data-testid={buildTestId('form')} />
      )}
    </SwapContainer>
  );
};
