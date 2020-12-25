import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { GetServerSideProps } from 'next';
import { getIpInfo, shouldBlockRegion } from '@swingby-protocol/ip-check';

import { SwapForm } from '../../../scenes/SwapForm';
import { GlobalStyles } from '../../../modules/styles';
import { SdkContextProvider } from '../../../modules/sdk-context';
import { useWidgetPathParams } from '../../../modules/path-params';
import { actionSetSwapFormData } from '../../../modules/store/swapForm';
import { IpInfoContextValue, IpInfoProvider } from '../../../modules/ip-blocks';

type Props = { ipInfo: IpInfoContextValue };

export default function ResourceNew({ ipInfo }: Props) {
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
    <IpInfoProvider value={ipInfo}>
      <SdkContextProvider mode={mode}>
        <GlobalStyles />
        <SwapForm resource={resource} />
      </SdkContextProvider>
    </IpInfoProvider>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  const clientIp =
    (typeof req.headers['x-real-ip'] === 'string' ? req.headers['x-real-ip'] : null) ??
    req.connection.remoteAddress ??
    null;

  const ipInfo = await (async () => {
    try {
      if (!clientIp || !process.env.IPSTACK_API_KEY) return null;
      return await getIpInfo({
        ip: clientIp,
        ipstackApiKey: process.env.IPSTACK_API_KEY,
      });
    } catch (e) {
      return null;
    }
  })();

  const blockRegion = (() => {
    try {
      if (!ipInfo) return false;
      return shouldBlockRegion(ipInfo);
    } catch (e) {
      return false;
    }
  })();

  return { props: { ipInfo: { ipInfo, clientIp, blockRegion } } };
};
