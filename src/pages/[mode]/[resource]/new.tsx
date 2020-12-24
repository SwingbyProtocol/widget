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

type Props = { blockRegion: boolean; clientIp: string; ipInfo: any };

export default function ResourceNew({ blockRegion, clientIp }: Props) {
  console.log({ blockRegion, clientIp });
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

  if (blockRegion) {
    return <>You cannot access this product from your country.</>;
  }

  if (!mode) return <></>;
  if (!resource) return <></>;

  return (
    <SdkContextProvider mode={mode}>
      <GlobalStyles />
      <SwapForm resource={resource} />
    </SdkContextProvider>
  );
}

export const getServerSideProps: GetServerSideProps<Props> = async ({ req }) => {
  const clientIp =
    (typeof req.headers['x-real-ip'] === 'string' ? req.headers['x-real-ip'] : undefined) ??
    req.connection.remoteAddress ??
    '';

  const ipInfo = await (async () => {
    try {
      return await getIpInfo({
        ip: clientIp,
        ipstackApiKey: process.env.IPSTACK_API_KEY ?? '',
      });
    } catch (e) {
      return null;
    }
  })();

  const blockRegion = (() => {
    try {
      return shouldBlockRegion(ipInfo as any);
    } catch (e) {
      return false;
    }
  })();

  return {
    props: { blockRegion, clientIp, ipInfo },
  };
};
