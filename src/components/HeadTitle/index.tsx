import Head from 'next/head';
import { useIntl } from 'react-intl';

import { useSdkContext } from '../../modules/sdk-context';
import { useGetSwapDetails } from '../../scenes/useGetSwapDetails';

export const HeadTitle = () => {
  const { swapHash } = useGetSwapDetails();
  const { mode } = useSdkContext();
  const { formatMessage } = useIntl();
  const page = swapHash ? 'details' : 'form';
  return (
    <Head>
      <title>{formatMessage({ id: `widget.tab-title.${mode}.${page}` }, { swapHash })}</title>
    </Head>
  );
};
