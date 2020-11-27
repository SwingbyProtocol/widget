import { useCallback } from 'react';
import {
  Button,
  CoinIcon,
  Icon,
  useMatchMedia,
  useBuildTestId,
  Loading,
} from '@swingby-protocol/pulsar';
import { useIntl } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { BackButton } from '../../../components/BackButton';
import { CoinAmount } from '../../../components/CoinAmount';
import {
  actionSetStep,
  actionSetSwapData,
  useAreCurrenciesValid,
  useCreateSwap,
  useIsAddressOutValid,
} from '../../../modules/store/swapForm';
import { StylingConstants } from '../../../modules/styles';

import { BannerContainer, ResponsiveSpace, AddressInput } from './styled';

export const Banner = () => {
  const { buildTestId } = useBuildTestId({ id: 'banner' });
  const { formatMessage } = useIntl();
  const hasWideWidth = useMatchMedia({ query: StylingConstants.mediaWideWidth });
  const { currencyOut, addressOut, step } = useSelector((state) => state.swapForm);
  const { areCurrenciesValid: areFormAmountsValid } = useAreCurrenciesValid();
  const dispatch = useDispatch();
  const { isAddressOutValid } = useIsAddressOutValid();
  const { loading, createSwap } = useCreateSwap();

  return (
    <BannerContainer>
      {step === 'step-address' ? (
        <>
          <BackButton
            onClick={() => dispatch(actionSetStep('step-amounts'))}
            data-testid={buildTestId(`${step}.back-btn`)}
          />
          <ResponsiveSpace />
          <AddressInput
            size="state"
            left={<CoinIcon symbol={currencyOut} />}
            value={addressOut}
            onChange={(evt) => dispatch(actionSetSwapData({ addressOut: evt.target.value }))}
            placeholder={formatMessage({ id: 'widget.receiving-address.placeholder' })}
            data-testid={buildTestId(`${step}.receiving-address`)}
          />
          <ResponsiveSpace />
          <Button
            variant="primary"
            size="state"
            shape="fit"
            disabled={!areFormAmountsValid || !isAddressOutValid || loading}
            onClick={createSwap}
            data-testid={buildTestId(`${step}.swap-btn`)}
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
          <CoinAmount variant="banner" data-testid={buildTestId(`${step}.amounts`)} />
          <ResponsiveSpace />
          <Button
            variant="primary"
            size="state"
            shape="fit"
            disabled={!areFormAmountsValid}
            onClick={() => dispatch(actionSetStep('step-address'))}
            data-testid={buildTestId(`${step}.next-btn`)}
          >
            {hasWideWidth ? formatMessage({ id: 'widget.swap-btn' }) : <Icon.CaretRight />}
          </Button>
        </>
      )}
    </BannerContainer>
  );
};
