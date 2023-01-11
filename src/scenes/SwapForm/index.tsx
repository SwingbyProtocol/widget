import { SkybridgeResource } from '@swingby-protocol/sdk';
import { Dispatch, useEffect, useState } from 'react';

import { useWidgetLayout } from '../../modules/layout';
import { WidgetContainer } from '../../components/WidgetContainer';
import { HeadTitle } from '../../components/HeadTitle';
import { Favicon } from '../../components/Favicon';
import { useIpInfo } from '../../modules/ip-blocks';
import { IpBlockWarning } from '../../components/IpBlockWarning';
import {
  actionSetSwapFormData,
  useAreCurrenciesValid,
  useIsReceivingAddressValid,
} from '../../modules/store/swapForm';
import { useIsBridgeUnderMaintenance } from '../../modules/maintenance-mode';
import { useCreate } from '../../modules/create-swap';

import { Vertical } from './Vertical';
import { Banner } from './Banner';

type ValidFormReturn = {
  errorText?: string;
  loading: boolean;
  formValid: boolean;
  executionError: string | null;
  create: () => Promise<void>;
  isFormEmpty: boolean;
};

type FormProps = {
  resource: SkybridgeResource;
};

export const checkUD = async (
  search_value: string,
  currencyReceiving: string,
  dispatch: Dispatch<any>,
) => {
  if (!search_value) return;
  const API_URL = 'https://resolve.unstoppabledomains.com/domains/';
  const API_KEY1 = process.env.NEXT_PUBLIC_UD_API_KEY;
  try {
    var res = await fetch(API_URL + search_value, {
      headers: {
        Authorization: `bearer ${API_KEY1}`,
      },
    });
    var data = await res.json();
    var result = null;
    if (currencyReceiving === 'BTC') result = data.records['crypto.BTC.address'];
    else result = data.records['crypto.ETH.address'];
    dispatch(actionSetSwapFormData({ addressReceiving: result }));
  } catch (err) {
    dispatch(actionSetSwapFormData({ addressReceiving: search_value }));
  }
};

export function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const useValidateForm = ({ resource }: FormProps): ValidFormReturn => {
  const { areCurrenciesAndAmountValid } = useAreCurrenciesValid({ resource });
  const { isReceivingAddressValid, isTaprootAddress, isAddressEmpty } =
    useIsReceivingAddressValid();
  const { isBridgeUnderMaintenance } = useIsBridgeUnderMaintenance();
  const { loading, create, error } = useCreate({ resource });
  const [errorText, setErrorText] = useState('');

  const formValid = isAddressEmpty
    ? true
    : areCurrenciesAndAmountValid && isReceivingAddressValid && !isBridgeUnderMaintenance && !error;

  useEffect(() => {
    if (formValid) {
      setErrorText('');
      return;
    }
    if (!areCurrenciesAndAmountValid) {
      setErrorText('widget.invalid-amounts');
      return;
    }
    if (isTaprootAddress) {
      setErrorText('widget.taproot-swap-not-supported-address');
      return;
    }
    if (!isReceivingAddressValid) {
      setErrorText('widget.invalid-address');
      return;
    }
    if (isBridgeUnderMaintenance) {
      setErrorText('widget.maintenance-warning');
      return;
    }
  }, [
    areCurrenciesAndAmountValid,
    formValid,
    loading,
    isBridgeUnderMaintenance,
    isReceivingAddressValid,
    isTaprootAddress,
    setErrorText,
  ]);

  return {
    errorText,
    formValid,
    loading,
    executionError: error,
    create,
    isFormEmpty: isAddressEmpty,
  };
};

export const SwapForm = ({ resource }: { resource: SkybridgeResource }) => {
  const layout = useWidgetLayout();
  const { shouldBlockIp } = useIpInfo();
  return (
    <>
      {shouldBlockIp && <IpBlockWarning />}
      <HeadTitle />
      <Favicon />
      <WidgetContainer>
        {layout === 'widget-banner' ? (
          <Banner resource={resource} />
        ) : (
          <Vertical resource={resource} />
        )}
      </WidgetContainer>
    </>
  );
};
