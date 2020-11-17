import { useState } from 'react';

import { SwapContainer } from './styled';
import { Form } from './Form';
import { SendTo } from './SendTo';

export const Vertical = () => {
  const [step, setStep] = useState<'form' | 'send-to'>('form');
  return (
    <SwapContainer>
      {step === 'send-to' && <SendTo onClickBack={() => setStep('form')} />}
      {step === 'form' && <Form onClickSwap={() => setStep('send-to')} />}
    </SwapContainer>
  );
};
