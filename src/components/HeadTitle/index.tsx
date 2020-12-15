import Head from 'next/head';
import { useIntl } from 'react-intl';

import { useWidgetPathParams } from '../../modules/path-params';

export const HeadTitle = () => {
  // const { mode, resource, hash } = useWidgetPathParams();
  // const { formatMessage } = useIntl();
  // const page = hash ? 'details' : 'form';
  return (
    <Head>
      {/* <title>
        {formatMessage({ id: `widget.tab-title.${resource}.${mode}.${page}` }, { hash })}
      </title> */}
    </Head>
  );
};
