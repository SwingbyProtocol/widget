import { Button, CoinIcon, Loading, TextInput, useBuildTestId } from '@swingby-protocol/pulsar';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { SkybridgeResource } from '@swingby-protocol/sdk';

import { CoinAmount } from '../../../components/CoinAmount';
import {
  actionSetSwapFormData,
  actionSetSwapFormStep,
  StepType,
  useAreCurrenciesValid,
  useIsReceivingAddressValid,
} from '../../../modules/store/swapForm';
import { Space } from '../../../components/Space';
import { useWidgetLayout } from '../../../modules/layout';
import { VerticalWidgetView } from '../../../components/VerticalWidgetView';
import { Separator } from '../../../components/Separator';
import { useCreate } from '../../../modules/create-swap';
import { NodeSelector } from '../../../components/NodeSelector';
import { useIsBridgeUnderMaintenance } from '../../../modules/maintenance-mode';

import {
  ErrorBox,
  ErrorContainer,
  ErrorTitle,
  StakeEarn,
  TermsOfUseContainer,
  TermsOfUseLink,
} from './styled';

export const Vertical = ({ resource }: { resource: SkybridgeResource }) => {
  const { buildTestId } = useBuildTestId({ id: 'vertical.form' });
  const { formatMessage } = useIntl();
  const { addressReceiving, currencyReceiving, step } = useSelector((state) => state.swapForm);
  const dispatch = useDispatch();
  const layout = useWidgetLayout();
  const { areCurrenciesAndAmountValid } = useAreCurrenciesValid({ resource });
  const { isReceivingAddressValid } = useIsReceivingAddressValid();
  const { loading, create, error } = useCreate({ resource });
  const { isBridgeUnderMaintenance } = useIsBridgeUnderMaintenance();

  return (
    <VerticalWidgetView
      onClickBack={
        step === 'step-address' && layout !== 'widget-full' && layout !== 'website'
          ? () => dispatch(actionSetSwapFormStep(StepType.stepAmounts))
          : undefined
      }
      data-testid={buildTestId('')}
    >
      {layout === 'website' && <NodeSelector />}

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
        <TermsOfUseContainer>
          <FormattedMessage
            id="widget.terms-of-use-warning"
            values={{
              termsOfUse: (
                <TermsOfUseLink
                  rel="noreferrer"
                  target="_blank"
                  href="https://docs.swingby.network/terms.pdf"
                >
                  <FormattedMessage id="widget.terms-of-use-warning.link" />
                </TermsOfUseLink>
              ),
            }}
          />
        </TermsOfUseContainer>
      )}

      {(step === 'step-address' || layout === 'widget-full' || layout === 'website') && (
        <Button
          variant="primary"
          size="state"
          disabled={
            !areCurrenciesAndAmountValid ||
            !isReceivingAddressValid ||
            loading ||
            isBridgeUnderMaintenance
          }
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
          disabled={!areCurrenciesAndAmountValid || isBridgeUnderMaintenance}
          onClick={() => dispatch(actionSetSwapFormStep(StepType.stepAddress))}
          data-testid={buildTestId('next-btn')}
        >
          {formatMessage({ id: 'widget.next-btn' })}
        </Button>
      )}

      <StakeEarn as="span">
        <FormattedMessage id="widget.warning" />
      </StakeEarn>
    </VerticalWidgetView>
  );
};
