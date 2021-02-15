import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GetServerSideProps } from 'next';
import { useIntl } from 'react-intl';
import { createToast } from '@swingby-protocol/pulsar';
import { DateTime } from 'luxon';

import { SwapForm } from '../../../scenes/SwapForm';
import { GlobalStyles } from '../../../modules/styles';
import { useWidgetPathParams } from '../../../modules/path-params';
import { actionSetSwapFormData } from '../../../modules/store/swapForm';
import { IpInfoProvider } from '../../../modules/ip-blocks';
import { LocalStorage, server__ipCheckSecret } from '../../../modules/env';
import { logger } from '../../../modules/logger';
import { fetch } from '../../../modules/fetch';

type Props = { ipInfo: { ip: string | null; shouldBlockIp: boolean } };

export default function ResourceNew({ ipInfo }: Props) {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { resource, mode } = useWidgetPathParams();
  const {
    query: {
      defaultCurrencyDeposit,
      defaultCurrencyReceiving,
      defaultAddressReceiving,
      defaultAmountDesired,
      aff: affiliateCode,
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
    dispatch(actionSetSwapFormData({ amountDesired: defaultAmountDesired }));
  }, [dispatch, defaultAmountDesired]);

  useEffect(() => {
    if (typeof affiliateCode !== 'string' || !affiliateCode) return;

    if (typeof localStorage !== 'undefined') {
      logger.debug('New affiliate code "%s" saved into local storage', affiliateCode);
      localStorage.setItem(LocalStorage.AffiliateCode, affiliateCode);
      localStorage.setItem(LocalStorage.AffiliateCodeSavedAt, DateTime.local().toUTC().toISO());
    }

    dispatch(actionSetSwapFormData({ affiliateCode }));
  }, [dispatch, affiliateCode]);

  useEffect(() => {
    if (mode === 'test') {
      createToast({
        content: formatMessage({ id: 'widget.warning-test' }),
        type: 'info',
        toastId: 'testnet',
      });
    }
  }, [mode, formatMessage]);

  if (!mode) return <></>;
  if (!resource) return <></>;

  return (
    <IpInfoProvider value={ipInfo}>
      <GlobalStyles />
      <SwapForm resource={resource} />
    </IpInfoProvider>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  const ip = (() => {
    try {
      const value =
        (typeof req.headers['x-real-ip'] === 'string' ? req.headers['x-real-ip'] : null) ??
        req.connection.remoteAddress;

      if (!value) {
        return null;
      }

      return value;
    } catch (e) {
      logger.error(e, 'Error getting IP');
      return null;
    }
  })();

  return {
    props: {
      ipInfo: {
        ip,
        shouldBlockIp: await (async () => {
          try {
            const controller = new AbortController();
            const signal = controller.signal;

            setTimeout(() => {
              controller.abort();
            }, 1000);

            const result = await fetch<{ shouldBlock: boolean }>(
              `https://ip-check.swingby.network/api/v1/ip/${ip}/check?secret=${server__ipCheckSecret}`,
              { signal },
            );

            if (!result.ok) {
              return false;
            }

            return result.response.shouldBlock;
          } catch (e) {
            logger.error(e, 'Error locating IP');
            return false;
          }
        })(),
      },
    },
  };
};
