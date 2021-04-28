import { createOrUpdateToast, dismissToast } from '@swingby-protocol/pulsar';
import { getBridgeFor } from '@swingby-protocol/sdk';
import { useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useSelector } from 'react-redux';

import { fetcher } from '../fetch';
import { useSdkContext } from '../store/sdkContext';

enum ApiStatus {
  Online = 1,
  Offline = 0,
  ReducedService = 2,
  Maintenance = 3,
}

const TOAST_ID = 'bridge-under-maintenance';

export const useIsBridgeUnderMaintenance = () => {
  const { formatMessage } = useIntl();
  const { currencyDeposit, currencyReceiving } = useSelector((state) => state.swapForm);
  const context = useSdkContext();
  const currentBridge = useMemo(
    () => getBridgeFor({ context, currencyDeposit, currencyReceiving }),
    [context, currencyDeposit, currencyReceiving],
  );
  const [isBridgeUnderMaintenance, setBridgeUnderMaintenance] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const check = async () => {
      if (cancelled) return;

      if (context.mode !== 'production') {
        setBridgeUnderMaintenance(false);
        return;
      }

      try {
        const { status } = await fetcher<{ status: ApiStatus }>(
          `/api/${context.mode}/${currentBridge}/status`,
        );
        if (cancelled) return;
        setBridgeUnderMaintenance(status === ApiStatus.Maintenance);
      } catch (e) {
        if (cancelled) return;
        setBridgeUnderMaintenance(false);
      }

      setTimeout(check, 10000);
    };

    check();

    return () => {
      cancelled = true;
    };
  }, [context, currentBridge]);

  useEffect(() => {
    if (!isBridgeUnderMaintenance) {
      dismissToast({ toastId: TOAST_ID });
      return;
    }

    createOrUpdateToast({
      toastId: TOAST_ID,
      type: 'warning',
      content: formatMessage({ id: 'widget.maintenance-warning' }),
    });
  }, [isBridgeUnderMaintenance, formatMessage]);

  return useMemo(() => ({ isBridgeUnderMaintenance }), [isBridgeUnderMaintenance]);
};
