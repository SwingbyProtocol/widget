import { Button, CoinIcon, Loading, TextInput, useBuildTestId } from '@swingby-protocol/pulsar';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getChainFor, SkybridgeResource } from '@swingby-protocol/sdk';
import { useEffect, useState } from 'react';

import { CoinAmount } from '../../../components/CoinAmount';
import { actionSetSwapFormStep, StepType } from '../../../modules/store/swapForm';
import { Space } from '../../../components/Space';
import { useWidgetLayout } from '../../../modules/layout';
import { VerticalWidgetView } from '../../../components/VerticalWidgetView';
import { Separator } from '../../../components/Separator';
import { NodeSelector } from '../../../components/NodeSelector';
import { useValidateForm, checkUD, useDebounce } from '../index';

import {
  ErrorBox,
  ErrorContainer,
  ErrorTitle,
  StakeEarn,
  TermsOfUseContainer,
  TermsOfUseLink,
} from './styled';

type VerticalProps = {
  resource: SkybridgeResource;
};

export const Vertical = ({ resource }: VerticalProps) => {
  const { buildTestId } = useBuildTestId({ id: 'vertical.form' });
  const { formatMessage } = useIntl();
  const { addressReceiving, currencyReceiving, step } = useSelector((state) => state.swapForm);
  const dispatch = useDispatch();
  const layout = useWidgetLayout();
  const { formValid, errorText, loading, create, executionError, isFormEmpty } = useValidateForm({
    resource,
  });
  const [search, setSearch] = useState('');
  const debouncedValue = useDebounce<string>(search, 600);

  useEffect(() => {
    checkUD(debouncedValue, currencyReceiving, dispatch);
  }, [debouncedValue]);

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
            value={search}
            onChange={async (evt) => {
              setSearch(evt.target.value);
            }}
            placeholder={formatMessage({ id: 'widget.receiving-address.placeholder' })}
            label={formatMessage({ id: 'widget.receiving-address.label' })}
            data-testid={buildTestId('receiving-address')}
          />
        </>
      )}

      <Space size="street" shape="fill" />

      {!formValid && (
        <ErrorContainer>
          {executionError ? (
            <ErrorBox>{executionError}</ErrorBox>
          ) : (
            <ErrorTitle>
              <FormattedMessage
                id={errorText ? errorText : 'widget.swap-error-title'}
                values={{ network: getChainFor({ coin: currencyReceiving }) }}
              />
            </ErrorTitle>
          )}
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
          disabled={!formValid || loading || isFormEmpty}
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
          disabled={!formValid || isFormEmpty}
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
