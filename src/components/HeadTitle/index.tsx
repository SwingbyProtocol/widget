import Head from 'next/head';
import { useRouter } from 'next/router';
import { useIntl } from 'react-intl';

import { useSdkContext } from '../../modules/sdk-context';
import { useSwapHash } from '../../modules/swap-details';

export const HeadTitle = () => {
  const swapHash = useSwapHash();
  const { mode } = useSdkContext();
  const { formatMessage } = useIntl();
  const { route } = useRouter();
  const page = swapHash ? 'details' : 'form';
  const type = /^\/float/i.test(route) ? 'float' : 'swap';
  return (
    <Head>
      <title>
        {formatMessage({ id: `widget.tab-title.${type}.${mode}.${page}` }, { hash: swapHash })}
      </title>
    </Head>
  );
};
