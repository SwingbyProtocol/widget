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
} from '../../../modules/store/swapForm';
import { StylingConstants } from '../../../modules/styles';
import { useCreate } from '../../../modules/create-swap';

import { BannerContainer, ResponsiveSpace, AddressInput, StakeEarn } from './styled';

export const Banner = ({ resource }: { resource: SkybridgeResource }) => {
  const { buildTestId } = useBuildTestId({ id: 'banner.form' });
  const { formatMessage } = useIntl();
  const hasWideWidth = useMatchMedia({ query: StylingConstants.mediaWideWidth });
  const { currencyReceiving, addressReceiving, step } = useSelector((state) => state.swapForm);
  const { areCurrenciesAndAmountValid } = useAreCurrenciesValid({ resource });
  const dispatch = useDispatch();
  const { isReceivingAddressValid } = useIsReceivingAddressValid();
  const { loading, create } = useCreate({ resource });

  return (
    <BannerContainer>
      {step === 'step-address' ? (
        <>
          <BackButton
            onClick={() => dispatch(actionSetSwapFormStep('step-amounts'))}
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
            disabled={!areCurrenciesAndAmountValid || !isReceivingAddressValid || loading}
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
            disabled={!areCurrenciesAndAmountValid}
            onClick={() => dispatch(actionSetSwapFormStep('step-address'))}
            data-testid={buildTestId('next-btn')}
          >
            {hasWideWidth ? formatMessage({ id: 'widget.swap-btn' }) : <Icon.CaretRight />}
          </Button>
        </>
      )}
      <StakeEarn as="a" target="_blank" href="https://skybridge.info/pool">
        <FormattedMessage id="widget.stake-btc-earn-rewards" />
      </StakeEarn>
    </BannerContainer>
  );
};
