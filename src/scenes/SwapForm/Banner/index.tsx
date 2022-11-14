import {
  Button,
  CoinIcon,
  Icon,
  useMatchMedia,
  useBuildTestId,
  Loading,
} from '@swingby-protocol/pulsar';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { getChainFor, SkybridgeResource } from '@swingby-protocol/sdk';
import { useState } from 'react';

import { BackButton } from '../../../components/BackButton';
import { CoinAmount } from '../../../components/CoinAmount';
import {
  actionSetSwapFormStep,
  actionSetSwapFormData,
  StepType,
} from '../../../modules/store/swapForm';
import { StylingConstants } from '../../../modules/styles';
import { useValidateForm, checkUD } from '../index';

import {
  BannerContainer,
  ResponsiveSpace,
  AddressInput,
  StakeEarn,
  ErrorBox,
  ErrorTitle,
} from './styled';

export const Banner = ({ resource }: { resource: SkybridgeResource }) => {
  const { buildTestId } = useBuildTestId({ id: 'banner.form' });
  const { formatMessage } = useIntl();
  const hasWideWidth = useMatchMedia({ query: StylingConstants.mediaWideWidth });
  const { currencyReceiving, addressReceiving, step } = useSelector((state) => state.swapForm);
  const dispatch = useDispatch();
  const { formValid, errorText, loading, create, executionError } = useValidateForm({
    resource,
  });
  const [search, setSearch] = useState('');

  return (
    <BannerContainer step={step}>
      {!formValid && (
        <ErrorBox>
          {executionError ? (
            executionError
          ) : (
            <ErrorTitle>
              <FormattedMessage
                id={errorText ? errorText : 'widget.swap-error-title'}
                values={{ network: getChainFor({ coin: currencyReceiving }) }}
              />
            </ErrorTitle>
          )}
        </ErrorBox>
      )}
      {step === 'step-address' ? (
        <>
          <BackButton
            onClick={() => dispatch(actionSetSwapFormStep(StepType.stepAmounts))}
            data-testid={buildTestId('back-btn')}
          />
          <ResponsiveSpace />
          <AddressInput
            size="state"
            left={<CoinIcon symbol={currencyReceiving} />}
            value={search}
            onChange={async (evt) => {
              setSearch(evt.target.value);
              var address = await checkUD(evt.target.value);
              if (address) {
                dispatch(actionSetSwapFormData({ addressReceiving: address }));
              } else {
                dispatch(actionSetSwapFormData({ addressReceiving: evt.target.value }));
              }
            }}
            placeholder={formatMessage({ id: 'widget.receiving-address.placeholder' })}
            data-testid={buildTestId('receiving-address')}
          />
          <ResponsiveSpace />
          <Button
            variant="primary"
            size="state"
            shape="fit"
            disabled={!formValid || loading}
            onClick={create}
            data-testid={buildTestId('swap-btn')}
          >
            {loading ? (
              <Loading />
            ) : hasWideWidth ? (
              formatMessage({ id: 'widget.swap-btn' })
            ) : (
              <Icon.CaretRight />
            )}
          </Button>
        </>
      ) : (
        <>
          <CoinAmount variant="banner" resource={resource} data-testid={buildTestId('amounts')} />
          <ResponsiveSpace />
          <Button
            variant="primary"
            size="state"
            shape="fit"
            onClick={() => dispatch(actionSetSwapFormStep(StepType.stepAddress))}
            data-testid={buildTestId('next-btn')}
          >
            {hasWideWidth ? formatMessage({ id: 'widget.swap-btn' }) : <Icon.CaretRight />}
          </Button>
        </>
      )}
      <StakeEarn as="span">
        <FormattedMessage id="widget.warning" />
      </StakeEarn>
    </BannerContainer>
  );
};
