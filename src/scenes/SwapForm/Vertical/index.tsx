import { Button, CoinIcon, Loading, TextInput, useBuildTestId } from '@swingby-protocol/pulsar';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { SkybridgeResource } from '@swingby-protocol/sdk';

import { CoinAmount } from '../../../components/CoinAmount';
import {
  actionSetSwapFormStep,
  actionSetSwapFormData,
  useAreCurrenciesValid,
  useIsReceivingAddressValid,
} from '../../../modules/store/swapForm';
import { Space } from '../../../components/Space';
import { useWidgetLayout } from '../../../modules/layout';
import { VerticalWidgetView } from '../../../components/VerticalWidgetView';
import { Separator } from '../../../components/Separator';
import { useCreate } from '../../../modules/create-swap';

import { ErrorContainer, StakeEarn, ErrorBox, ErrorTitle } from './styled';

export const Vertical = ({ resource }: { resource: SkybridgeResource }) => {
  const { buildTestId } = useBuildTestId({ id: 'vertical.form' });
  const { formatMessage } = useIntl();
  const { addressReceiving, currencyReceiving, step } = useSelector((state) => state.swapForm);
  const dispatch = useDispatch();
  const layout = useWidgetLayout();
  const { areCurrenciesAndAmountValid } = useAreCurrenciesValid({ resource });
  const { isReceivingAddressValid } = useIsReceivingAddressValid();
  const { loading, create, error } = useCreate({ resource });

  return (
    <VerticalWidgetView
      onClickBack={
        step === 'step-address' && layout !== 'widget-full' && layout !== 'website'
          ? () => dispatch(actionSetSwapFormStep('step-amounts'))
          : undefined
      }
      data-testid={buildTestId('')}
    >
      {(step === 'step-amounts' || layout === 'widget-full' || layout === 'website') && (
        <CoinAmount variant="vertical" resource={resource} data-testid={buildTestId('amounts')} />
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
            left={<CoinIcon symbol={currencyReceiving} />}
            value={addressReceiving}
            onChange={(evt) =>
              dispatch(actionSetSwapFormData({ addressReceiving: evt.target.value }))
            }
            placeholder={formatMessage({ id: 'widget.receiving-address.placeholder' })}
            label={formatMessage({ id: 'widget.receiving-address.label' })}
            data-testid={buildTestId('receiving-address')}
          />
        </>
      )}

      <Space size="street" shape="fill" />

      {error && (
        <ErrorContainer>
          <ErrorTitle>
            <FormattedMessage id="widget.swap-error-title" />
          </ErrorTitle>
          <ErrorBox>{error}</ErrorBox>
        </ErrorContainer>
      )}

      {(step === 'step-address' || layout === 'widget-full' || layout === 'website') && (
        <Button
          variant="primary"
          size="state"
          disabled={!areCurrenciesAndAmountValid || !isReceivingAddressValid || loading}
          onClick={create}
          data-testid={buildTestId('swap-btn')}
        >
          {loading ? <Loading /> : formatMessage({ id: 'widget.swap-btn' })}
        </Button>
      )}

      {step === 'step-amounts' && layout !== 'widget-full' && layout !== 'website' && (
        <Button
          variant="primary"
          size="state"
          disabled={!areCurrenciesAndAmountValid}
          onClick={() => dispatch(actionSetSwapFormStep('step-address'))}
          data-testid={buildTestId('next-btn')}
        >
          {formatMessage({ id: 'widget.next-btn' })}
        </Button>
      )}

      <StakeEarn as="a" target="_blank" href="https://skybridge.info/pool">
        <FormattedMessage id="widget.stake-btc-earn-rewards" />
      </StakeEarn>
    </VerticalWidgetView>
  );
};
