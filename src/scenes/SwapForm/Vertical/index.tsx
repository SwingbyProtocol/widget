import { Button, CoinIcon, Loading, TextInput, useBuildTestId } from '@swingby-protocol/pulsar';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { CoinAmount } from '../../../components/CoinAmount';
import {
  actionSetStep,
  actionSetSwapData,
  useAreCurrenciesValid,
  useCreateSwap,
  useIsAddressOutValid,
} from '../../../modules/store/swapForm';
import { Space } from '../../../components/Space';
import { useWidgetLayout } from '../../../modules/layout';
import { VerticalWidgetView } from '../../../components/VerticalWidgetView';
import { Separator } from '../../../components/Separator';

import { SwapContainer } from './styled';

export const Vertical = () => {
  const { buildTestId } = useBuildTestId({ id: 'vertical.form' });
  const { formatMessage } = useIntl();
  const { addressOut, currencyOut, step } = useSelector((state) => state.swapForm);
  const dispatch = useDispatch();
  const layout = useWidgetLayout();
  const { areCurrenciesValid: areFormAmountsValid } = useAreCurrenciesValid();
  const { isAddressOutValid: isReceivingAddressValid } = useIsAddressOutValid();
  const { loading, createSwap } = useCreateSwap();

  return (
    <SwapContainer>
      <VerticalWidgetView
        onClickBack={
          step === 'step-address' && layout !== 'widget-full' && layout !== 'website'
            ? () => dispatch(actionSetStep('step-amounts'))
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
            onClick={createSwap}
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
            onClick={() => dispatch(actionSetStep('step-address'))}
            data-testid={buildTestId('next-btn')}
          >
            {formatMessage({ id: 'widget.next-btn' })}
          </Button>
        )}
      </VerticalWidgetView>
    </SwapContainer>
  );
};
