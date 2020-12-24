import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { SwapForm } from '../../../scenes/SwapForm';
import { GlobalStyles } from '../../../modules/styles';
import { SdkContextProvider } from '../../../modules/sdk-context';
import { useWidgetPathParams } from '../../../modules/path-params';
import { actionSetSwapFormData } from '../../../modules/store/swapForm';

export default function ResourceNew() {
  const dispatch = useDispatch();
  const { resource, mode } = useWidgetPathParams();
  const {
    query: {
      defaultCurrencyDeposit,
      defaultCurrencyReceiving,
      defaultAddressReceiving,
      defaultAmountDesired,
    },
  } = useRouter();

  useEffect(() => {
    if (typeof defaultCurrencyDeposit !== 'string' || !defaultCurrencyDeposit) return;
    dispatch(actionSetSwapFormData({ currencyDeposit: defaultCurrencyDeposit as any }));
  }, [dispatch, defaultCurrencyDeposit]);

  useEffect(() => {
    if (typeof defaultCurrencyReceiving !== 'string' || !defaultCurrencyReceiving) return;
    dispatch(actionSetSwapFormData({ currencyReceiving: defaultCurrencyReceiving as any }));
  }, [dispatch, defaultCurrencyReceiving]);

  useEffect(() => {
    if (typeof defaultAddressReceiving !== 'string' || !defaultAddressReceiving) return;
    dispatch(actionSetSwapFormData({ addressReceiving: defaultAddressReceiving as any }));
  }, [dispatch, defaultAddressReceiving]);

  useEffect(() => {
    if (typeof defaultAmountDesired !== 'string' || !defaultAmountDesired) return;
    dispatch(actionSetSwapFormData({ amountDesired: defaultAmountDesired as any }));
  }, [dispatch, defaultAmountDesired]);

  if (!mode) return <></>;
  if (!resource) return <></>;

  return (
    <SdkContextProvider mode={mode}>
      <GlobalStyles />
      <SwapForm resource={resource} />
    </SdkContextProvider>
  );
}
