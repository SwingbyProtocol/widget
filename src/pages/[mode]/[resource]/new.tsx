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
    query: { defaultCurrencyIn, defaultCurrencyOut, defaultAddressUserIn, defaultAmountUser },
  } = useRouter();

  useEffect(() => {
    if (typeof defaultCurrencyIn !== 'string' || !defaultCurrencyIn) return;
    dispatch(actionSetSwapFormData({ currencyIn: defaultCurrencyIn as any }));
  }, [dispatch, defaultCurrencyIn]);

  useEffect(() => {
    if (typeof defaultCurrencyOut !== 'string' || !defaultCurrencyOut) return;
    dispatch(actionSetSwapFormData({ currencyOut: defaultCurrencyOut as any }));
  }, [dispatch, defaultCurrencyOut]);

  useEffect(() => {
    if (typeof defaultAddressUserIn !== 'string' || !defaultAddressUserIn) return;
    dispatch(actionSetSwapFormData({ addressUserIn: defaultAddressUserIn as any }));
  }, [dispatch, defaultAddressUserIn]);

  useEffect(() => {
    if (typeof defaultAmountUser !== 'string' || !defaultAmountUser) return;
    dispatch(actionSetSwapFormData({ amountUser: defaultAmountUser as any }));
  }, [dispatch, defaultAmountUser]);

  if (!mode) return <></>;
  if (!resource) return <></>;

  return (
    <SdkContextProvider mode={mode}>
      <GlobalStyles />
      <SwapForm resource={resource} />
    </SdkContextProvider>
  );
}
