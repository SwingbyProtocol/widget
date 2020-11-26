import { CoinIcon, CopyToClipboard, Testable, useBuildTestId } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import { findSwap } from '@swingby-protocol/sdk';

import { FancyCryptoAmount } from '../../../FancyCryptoAmount';
import { useSetStep } from '../../../../modules/store/pagination';
import { StepIndicator } from '../StepIndicator';
import { StepView } from '../StepView';
import { useSdkContext } from '../../../../modules/sdk-context';
import { logger } from '../../../../modules/logger';

import { SendLabel } from './styled';

export const SendTo = ({ 'data-testid': testId }: Testable) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  const { currencyIn, addressIn, amountIn } = useSelector((state) => state.swap);
  const { setStep } = useSetStep();
  const context = useSdkContext();

  useEffect(() => {
    const id = setInterval(async () => {
      logger.debug('Will call findSwap(%O)', { addressIn, amountIn, currencyIn });
      const { transacionInHash, transactionOutHash, status } = await findSwap({
        context,
        addressIn,
        amountIn,
        currencyIn,
      });

      logger.debug('findSwap() returned: %O', { transacionInHash, transactionOutHash, status });
      if (status === 'completed' || status === 'refunded') {
        clearInterval(id);
      }
    }, 5000);

    return () => clearInterval(id);
  }, [context, addressIn, amountIn, currencyIn]);

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
