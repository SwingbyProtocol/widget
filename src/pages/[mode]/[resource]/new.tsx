import { shouldBlockRegion } from '@swingby-protocol/ip-check';
import { getSwapableTo } from '@swingby-protocol/sdk';
import { DateTime } from 'luxon';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { LocalStorage } from '../../../modules/env';
import { IpInfoProvider } from '../../../modules/ip-blocks';
import { logger } from '../../../modules/logger';
import { useWidgetPathParams } from '../../../modules/path-params';
import { actionSetSwapFormData } from '../../../modules/store/swapForm';
import { GlobalStyles } from '../../../modules/styles';
import { SwapForm } from '../../../scenes/SwapForm';

type Props = { ipInfo: { ip: string | null; shouldBlockIp: boolean } };

export default function ResourceNew({ ipInfo }: Props) {
  const dispatch = useDispatch();
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

    if (
      mode &&
      resource &&
      (typeof defaultCurrencyDeposit !== 'string' || !defaultCurrencyDeposit)
    ) {
      const coins = getSwapableTo({
        coin: defaultCurrencyReceiving as any,
        context: { mode },
        resource,
      });
      console.log({ coins });
      dispatch(actionSetSwapFormData({ currencyDeposit: coins[0] as any }));
    }

    dispatch(actionSetSwapFormData({ currencyReceiving: defaultCurrencyReceiving as any }));
  }, [dispatch, defaultCurrencyDeposit, defaultCurrencyReceiving, mode, resource]);

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
  return {
    props: {
      ipInfo: {
        ip: typeof req.headers['x-real-ip'] === 'string' ? req.headers['x-real-ip'] : null,
        shouldBlockIp: (() => {
          try {
            return shouldBlockRegion({
              regionCode: `${req.headers['x-vercel-ip-country']}`,
              innerRegionCode: `${req.headers['x-vercel-ip-country-region']}`,
            });
          } catch (e) {
            logger.error(e, 'Error checking whether region should be blocked');
            return false;
          }
        })(),
      },
    },
  };
};
