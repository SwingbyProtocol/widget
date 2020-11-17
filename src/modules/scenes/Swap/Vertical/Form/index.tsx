import { useEffect, useState } from 'react';
import { Button, CoinIcon, Testable, TextInput, useBuildTestId } from '@swingby-protocol/pulsar';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { CoinAmount } from '../../../../../components/CoinAmount';
import {
  actionSetFormData,
  useAreFormAmountsValid,
  useIsReceivingAddressValid,
} from '../../../../store/form';
import { Space } from '../../../../../components/Space';
import { useWidgetLayout } from '../../../../layout';
import { StepView } from '../StepView';

import { Separator } from './styled';

export const Form = ({
  onClickSwap,
  'data-testid': testId,
}: { onClickSwap: () => void } & Testable) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  const { formatMessage } = useIntl();
  const { receivingAddress } = useSelector((state) => state.form);
  const { currencyFrom } = useSelector((state) => state.form);
  const dispatch = useDispatch();
  const [step, setStep] = useState<'all' | 'amounts' | 'address'>('all');
  const layout = useWidgetLayout();
  const { areFormAmountsValid } = useAreFormAmountsValid();
  const { isReceivingAddressValid } = useIsReceivingAddressValid();

  useEffect(() => {
    if (layout === 'website' || layout === 'widget-full') {
      setStep('all');
      return;
    }

    setStep(isReceivingAddressValid ? 'address' : 'amounts');
  }, [layout, isReceivingAddressValid]);

  return (
    <StepView
      onClickBack={step === 'address' ? () => setStep('amounts') : undefined}
      data-testid={buildTestId('')}
    >
      {(step === 'all' || step === 'amounts') && (
        <CoinAmount variant="vertical" data-testid={buildTestId('amounts')} />
      )}

      {(step === 'all' || step === 'address') && (
        <>
          <Space size="street" />
          {step === 'all' && (
            <>
              <Separator />
              <Space size="street" />
            </>
          )}
          <TextInput
            size="state"
            left={<CoinIcon symbol={currencyFrom} />}
            value={receivingAddress}
            onChange={(evt) => dispatch(actionSetFormData({ receivingAddress: evt.target.value }))}
            placeholder={formatMessage({ id: 'widget.receiving-address.placeholder' })}
            label={formatMessage({ id: 'widget.receiving-address.label' })}
          />
        </>
      )}

      <Space size="street" shape="fill" />

      {(step === 'all' || step === 'address') && (
        <Button
          variant="primary"
          size="state"
          disabled={!areFormAmountsValid || !isReceivingAddressValid}
          onClick={onClickSwap}
        >
          {formatMessage({ id: 'widget.swap-btn' })}
        </Button>
      )}

      {step === 'amounts' && (
        <Button
          variant="primary"
          size="state"
          disabled={!areFormAmountsValid}
          onClick={() => setStep('address')}
        >
          {formatMessage({ id: 'widget.next-btn' })}
        </Button>
      )}
    </StepView>
  );
};
