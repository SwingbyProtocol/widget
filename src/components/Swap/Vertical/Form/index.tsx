import { Button, CoinIcon, Testable, TextInput, useBuildTestId } from '@swingby-protocol/pulsar';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { CoinAmount } from '../../../CoinAmount';
import {
  actionSetFormData,
  useAreCurrenciesValid,
  useIsAddressOutValid,
} from '../../../../modules/store/swap';
import { Space } from '../../../Space';
import { useWidgetLayout } from '../../../../modules/layout';
import { StepView } from '../StepView';
import { useSetStep } from '../../../../modules/store/pagination';

import { Separator } from './styled';

export const Form = ({ 'data-testid': testId }: Testable) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  const { formatMessage } = useIntl();
  const { addressOut } = useSelector((state) => state.swap);
  const { currencyOut } = useSelector((state) => state.swap);
  const dispatch = useDispatch();
  const step = useSelector((state) => state.pagination.step);
  const { setStep } = useSetStep();
  const layout = useWidgetLayout();
  const { areCurrenciesValid: areFormAmountsValid } = useAreCurrenciesValid();
  const { isAddressOutValid: isReceivingAddressValid } = useIsAddressOutValid();

  return (
    <StepView
      onClickBack={
        step === 'step-address' && layout !== 'widget-full' && layout !== 'website'
          ? () => setStep('step-amounts')
          : undefined
      }
      data-testid={buildTestId('')}
    >
      {(step === 'step-amounts' || layout === 'widget-full' || layout === 'website') && (
        <CoinAmount variant="vertical" data-testid={buildTestId('amounts')} />
      )}

      {(step === 'step-address' || layout === 'widget-full' || layout === 'website') && (
        <>
          {(layout === 'widget-full' || layout === 'website') && (
            <>
              <Space size="street" />
              <Separator />
              <Space size="street" />
            </>
          )}
          <TextInput
            size="state"
            left={<CoinIcon symbol={currencyOut} />}
            value={addressOut}
            onChange={(evt) => dispatch(actionSetFormData({ addressOut: evt.target.value }))}
            placeholder={formatMessage({ id: 'widget.receiving-address.placeholder' })}
            label={formatMessage({ id: 'widget.receiving-address.label' })}
            data-testid={buildTestId('receiving-address')}
          />
        </>
      )}

      <Space size="street" shape="fill" />

      {(step === 'step-address' || layout === 'widget-full' || layout === 'website') && (
        <Button
          variant="primary"
          size="state"
          disabled={!areFormAmountsValid || !isReceivingAddressValid}
          onClick={() => setStep('step-submitted')}
          data-testid={buildTestId('swap-btn')}
        >
          {formatMessage({ id: 'widget.swap-btn' })}
        </Button>
      )}

      {step === 'step-amounts' && layout !== 'widget-full' && layout !== 'website' && (
        <Button
          variant="primary"
          size="state"
          disabled={!areFormAmountsValid}
          onClick={() => setStep('step-address')}
          data-testid={buildTestId('next-btn')}
        >
          {formatMessage({ id: 'widget.next-btn' })}
        </Button>
      )}
    </StepView>
  );
};