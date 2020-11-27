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
  actionSetSwapFormStep,
  actionSetSwapFormData,
  useAreCurrenciesValid,
  useIsReceivingAddressValid,
} from '../../../modules/store/swapForm';
import { StylingConstants } from '../../../modules/styles';
import { useCreateSwap } from '../../../modules/create-swap';

import { BannerContainer, ResponsiveSpace, AddressInput } from './styled';

export const Banner = () => {
  const { buildTestId } = useBuildTestId({ id: 'banner' });
  const { formatMessage } = useIntl();
  const hasWideWidth = useMatchMedia({ query: StylingConstants.mediaWideWidth });
  const { currencyOut, addressUserIn, step } = useSelector((state) => state.swapForm);
  const { areCurrenciesValid: areFormAmountsValid } = useAreCurrenciesValid();
  const dispatch = useDispatch();
  const { isReceivingAddressValid } = useIsReceivingAddressValid();
  const { loading, createSwap } = useCreateSwap();

  return (
    <BannerContainer>
      {step === 'step-address' ? (
        <>
          <BackButton
            onClick={() => dispatch(actionSetSwapFormStep('step-amounts'))}
            data-testid={buildTestId(`${step}.back-btn`)}
          />
          <ResponsiveSpace />
          <AddressInput
            size="state"
            left={<CoinIcon symbol={currencyOut} />}
            value={addressUserIn}
            onChange={(evt) => dispatch(actionSetSwapFormData({ addressUserIn: evt.target.value }))}
            placeholder={formatMessage({ id: 'widget.receiving-address.placeholder' })}
            data-testid={buildTestId(`${step}.receiving-address`)}
          />
          <ResponsiveSpace />
          <Button
            variant="primary"
            size="state"
            shape="fit"
            disabled={!areFormAmountsValid || !isReceivingAddressValid || loading}
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
            onClick={() => dispatch(actionSetSwapFormStep('step-address'))}
            data-testid={buildTestId(`${step}.next-btn`)}
          >
            {hasWideWidth ? formatMessage({ id: 'widget.swap-btn' }) : <Icon.CaretRight />}
          </Button>
        </>
      )}
    </BannerContainer>
  );
};
