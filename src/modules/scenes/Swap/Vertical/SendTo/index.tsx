import { CoinIcon, CopyToClipboard, Testable, useBuildTestId } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { FancyCryptoAmount } from '../../../../../components/FancyCryptoAmount';
import { useSetStep } from '../../../../store/pagination';
import { StepIndicator } from '../StepIndicator';
import { StepView } from '../StepView';

import { SendLabel } from './styled';

export const SendTo = ({ 'data-testid': testId }: Testable) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  const { currencyIn } = useSelector((state) => state.swap);
  const { setStep } = useSetStep();
  return (
    <StepView
      onClickBack={() => setStep('step-address')}
      top={
        <>
          <SendLabel data-testid={buildTestId('top.send-label')}>
            <FormattedMessage
              id="widget.send-to-long"
              values={{ value: <FancyCryptoAmount amount={1} displaySymbol={currencyIn} /> }}
            />
          </SendLabel>
          <CopyToClipboard
            value="aaaaa"
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
