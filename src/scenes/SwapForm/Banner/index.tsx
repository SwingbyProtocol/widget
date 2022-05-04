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
import { SkybridgeResource } from '@swingby-protocol/sdk';

import { BackButton } from '../../../components/BackButton';
import { CoinAmount } from '../../../components/CoinAmount';
import {
  actionSetSwapFormStep,
  actionSetSwapFormData,
  useAreCurrenciesValid,
  useIsReceivingAddressValid,
  StepType,
} from '../../../modules/store/swapForm';
import { StylingConstants } from '../../../modules/styles';
import { useCreate } from '../../../modules/create-swap';
import { useIsBridgeUnderMaintenance } from '../../../modules/maintenance-mode';

import { BannerContainer, ResponsiveSpace, AddressInput, StakeEarn, ErrorBox } from './styled';

export const Banner = ({ resource }: { resource: SkybridgeResource }) => {
  const { buildTestId } = useBuildTestId({ id: 'banner.form' });
  const { formatMessage } = useIntl();
  const hasWideWidth = useMatchMedia({ query: StylingConstants.mediaWideWidth });
  const { currencyReceiving, addressReceiving, step } = useSelector((state) => state.swapForm);
  const { areCurrenciesAndAmountValid } = useAreCurrenciesValid({ resource });
  const dispatch = useDispatch();
  const { isReceivingAddressValid } = useIsReceivingAddressValid();
  const { loading, create, error } = useCreate({ resource });
  const { isBridgeUnderMaintenance } = useIsBridgeUnderMaintenance();

  return (
    <BannerContainer>
      {error && <ErrorBox>{error}</ErrorBox>}
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
            value={addressReceiving}
            onChange={(evt) =>
              dispatch(actionSetSwapFormData({ addressReceiving: evt.target.value }))
            }
            placeholder={formatMessage({ id: 'widget.receiving-address.placeholder' })}
            data-testid={buildTestId('receiving-address')}
          />
          <ResponsiveSpace />
          <Button
            variant="primary"
            size="state"
            shape="fit"
            disabled={
              !areCurrenciesAndAmountValid ||
              !isReceivingAddressValid ||
              loading ||
              isBridgeUnderMaintenance
            }
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
            disabled={!areCurrenciesAndAmountValid || isBridgeUnderMaintenance}
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
