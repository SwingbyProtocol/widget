import { Button, CoinIcon, Loading, TextInput, useBuildTestId } from '@swingby-protocol/pulsar';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { CoinAmount } from '../../../components/CoinAmount';
import {
  actionSetSwapData,
  useAreCurrenciesValid,
  useCreateSwap,
  useIsAddressOutValid,
} from '../../../modules/store/swap';
import { Space } from '../../../components/Space';
import { useWidgetLayout } from '../../../modules/layout';
import { VerticalWidgetView } from '../../../components/VerticalWidgetView';
import { useSetStep } from '../../../modules/store/pagination';
import { logger } from '../../../modules/logger';
import { Separator } from '../../../components/Separator';

import { SwapContainer } from './styled';

export const Vertical = () => {
  const { buildTestId } = useBuildTestId({ id: 'vertical.form' });
  const step = useSelector((state) => state.pagination.step);
  const { formatMessage } = useIntl();
  const { addressOut } = useSelector((state) => state.swap);
  const { currencyOut } = useSelector((state) => state.swap);
  const dispatch = useDispatch();
  const { setStep } = useSetStep();
  const layout = useWidgetLayout();
  const { areCurrenciesValid: areFormAmountsValid } = useAreCurrenciesValid();
  const { isAddressOutValid: isReceivingAddressValid } = useIsAddressOutValid();
  const { loading, createSwap } = useCreateSwap();

  const clickSwap = useCallback(async () => {
    try {
      await createSwap();
      setStep('step-submitted');
    } catch (e) {
      logger.error('Failed to create swap', e);
    }
  }, [createSwap, setStep]);

  return (
    <SwapContainer>
      <VerticalWidgetView
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
              onChange={(evt) => dispatch(actionSetSwapData({ addressOut: evt.target.value }))}
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
            disabled={!areFormAmountsValid || !isReceivingAddressValid || loading}
            onClick={clickSwap}
            data-testid={buildTestId('swap-btn')}
          >
            {loading ? <Loading /> : formatMessage({ id: 'widget.swap-btn' })}
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
      </VerticalWidgetView>
    </SwapContainer>
  );
};
