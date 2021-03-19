import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GetServerSideProps } from 'next';
import { FormattedMessage, useIntl } from 'react-intl';
import { createToast, Text } from '@swingby-protocol/pulsar';
import { DateTime } from 'luxon';
import { shouldBlockRegion } from '@swingby-protocol/ip-check';

import { SwapForm } from '../../../scenes/SwapForm';
import { GlobalStyles } from '../../../modules/styles';
import { useWidgetPathParams } from '../../../modules/path-params';
import { actionSetSwapFormData } from '../../../modules/store/swapForm';
import { IpInfoProvider } from '../../../modules/ip-blocks';
import { LocalStorage } from '../../../modules/env';
import { logger } from '../../../modules/logger';

import { TextTutorial } from './styled';

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
    createToast({
      content: (
        <>
          <Text>
            <FormattedMessage
              id={mode === 'test' ? 'widget.warning-test' : 'widget.warning-production'}
            />
          </Text>{' '}
          <TextTutorial
            as="a"
            target="_blank"
            href="https://swingby.medium.com/how-to-convert-your-wbtc-into-btc-with-skybridge-8eebe2b711ad"
          >
            <FormattedMessage id="widget.tutorial" />
          </TextTutorial>
        </>
      ),
      type: 'info',
      toastId: 'testnet',
    });
  }, [mode]);

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
