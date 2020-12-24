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

type Props = { blockRegion: boolean; ipInfo: any; ip: string; headers: any };

export default function ResourceNew({ blockRegion, ipInfo, ip, headers }: Props) {
  console.log({ headers, ip, ipInfo });
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
  let ipInfo: any;
  const blockRegion = await (async () => {
    try {
      ipInfo = await getIpInfo({
        ip: req.connection.remoteAddress ?? '',
        ipstackApiKey: process.env.IPSTACK_API_KEY ?? '',
      });
      return shouldBlockRegion(ipInfo);
    } catch (e) {
      return false;
    }
  })();

  return {
    props: { blockRegion, ipInfo, ip: req.connection.remoteAddress ?? '', headers: req.headers },
  };
};
