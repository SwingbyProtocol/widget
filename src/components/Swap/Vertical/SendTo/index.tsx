import { CoinIcon, CopyToClipboard, Testable, useBuildTestId } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { FancyCryptoAmount } from '../../../FancyCryptoAmount';
import { useSetStep } from '../../../../modules/store/pagination';
import { StepIndicator } from '../StepIndicator';
import { StepView } from '../StepView';

import { SendLabel } from './styled';

export const SendTo = ({ 'data-testid': testId }: Testable) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  const { currencyIn, addressIn, amountIn } = useSelector((state) => state.swap);
  const { setStep } = useSetStep();
  return (
    <StepView
      onClickBack={() => setStep('step-address')}
      top={
        <>
          <SendLabel data-testid={buildTestId('top.send-label')}>
            <FormattedMessage
              id="widget.send-to-long"
              values={{
                value: <FancyCryptoAmount amount={+amountIn} displaySymbol={currencyIn} />,
              }}
            />
          </SendLabel>
          <CopyToClipboard
            value={addressIn}
            left={<CoinIcon symbol={currencyIn} />}
            size="country"
            data-testid={buildTestId('top.address')}
          />
        </>
      }
      data-testid={buildTestId('')}
    >
      <StepIndicator status="waiting" data-testid={buildTestId('bottom.step-indicator')} />
    </StepView>
  );
};
