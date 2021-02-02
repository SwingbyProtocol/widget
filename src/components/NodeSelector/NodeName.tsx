import { FormattedMessage, useIntl } from 'react-intl';

import { getNodeDisplayName } from './getNodeDisplayName';

type Props = { node: string | null; ping: number | null | undefined };

export const NodeName = ({ node, ping }: Props) => {
  const { formatNumber } = useIntl();
  const pingString = !ping
    ? null
    : ` (${formatNumber(ping, { style: 'unit', unit: 'second', maximumSignificantDigits: 2 })})`;

  return (
    <FormattedMessage
      id="widget.node-selector.node-name"
      values={{
        nodeName: getNodeDisplayName(node),
        ping: pingString,
      }}
    />
  );
};
