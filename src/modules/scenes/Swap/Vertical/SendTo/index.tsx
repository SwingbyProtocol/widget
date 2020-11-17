import { CoinIcon, CopyToClipboard, Testable, useBuildTestId } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { FancyCryptoAmount } from '../../../../../components/FancyCryptoAmount';
import { StepIndicator } from '../StepIndicator';
import { StepView } from '../StepView';

import { SendLabel } from './styled';

export const SendTo = ({
  onClickBack,
  'data-testid': testId,
}: { onClickBack: () => void } & Testable) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  const { currencyFrom } = useSelector((state) => state.form);
  return (
    <StepView
      onClickBack={onClickBack}
      top={
        <>
          <SendLabel data-testid={buildTestId('top.send-label')}>
            <FormattedMessage
              id="widget.send-to-long"
              values={{ value: <FancyCryptoAmount amount={1} displaySymbol={currencyFrom} /> }}
            />
          </SendLabel>
          <CopyToClipboard
            value="aaaaa"
            left={<CoinIcon symbol={currencyFrom} />}
            size="country"
            data-testid={buildTestId('top.address')}
          />
        </>
      }
      data-testid={buildTestId('')}
    >
      <StepIndicator status="awaiting-deposit" data-testid={buildTestId('bottom.step-indicator')} />
    </StepView>
  );
};
