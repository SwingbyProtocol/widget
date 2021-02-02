import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GetServerSideProps } from 'next';
import { getIpInfoFromRequest, IpInfoFromRequest } from '@swingby-protocol/ip-check';
import { useIntl } from 'react-intl';
import { createToast } from '@swingby-protocol/pulsar';

import { SwapForm } from '../../../scenes/SwapForm';
import { GlobalStyles } from '../../../modules/styles';
import { useWidgetPathParams } from '../../../modules/path-params';
import { actionSetSwapFormData } from '../../../modules/store/swapForm';
import { IpInfoProvider } from '../../../modules/ip-blocks';

type Props = { ipInfo: IpInfoFromRequest };

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
  return {
    props: { ipInfo: await getIpInfoFromRequest({ req, ipApiKey: process.env.IPAPI_API_KEY }) },
  };
};
