import { SkybridgeResource } from '@swingby-protocol/sdk';
import { useEffect, useState } from 'react';

import { useWidgetLayout } from '../../modules/layout';
import { WidgetContainer } from '../../components/WidgetContainer';
import { HeadTitle } from '../../components/HeadTitle';
import { Favicon } from '../../components/Favicon';
import { useIpInfo } from '../../modules/ip-blocks';
import { IpBlockWarning } from '../../components/IpBlockWarning';
import { useAreCurrenciesValid, useIsReceivingAddressValid } from '../../modules/store/swapForm';
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

export const useValidateForm = ({ resource }: FormProps): ValidFormReturn => {
  const { areCurrenciesAndAmountValid } = useAreCurrenciesValid({ resource });
  const {
    isReceivingAddressValid,
    isTaprootAddress,
    isAddressEmpty,
  } = useIsReceivingAddressValid();
  const { isBridgeUnderMaintenance } = useIsBridgeUnderMaintenance();
  const { loading, create, error } = useCreate({ resource });
  const [errorText, setErrorText] = useState('');

  const formValid = isAddressEmpty
    ? true
    : areCurrenciesAndAmountValid &&
      isReceivingAddressValid &&
      !loading &&
      !isBridgeUnderMaintenance;

  useEffect(() => {
    if (formValid) {
      setErrorText('');
      return;
    }
    if (!areCurrenciesAndAmountValid) {
      setErrorText('Currencies invalid');
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
