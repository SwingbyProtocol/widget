import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useTheme } from 'styled-components';

import { getNodeDisplayName } from './getNodeDisplayName';
import { FancyDot } from './styled';

type Props = { node: string | null; ping: number | null | undefined };

export const NodeName = ({ node, ping }: Props) => {
  const { formatNumber } = useIntl();
  const theme = useTheme();
  const pingString = useMemo(
    () =>
      !ping ? null : (
        <>
          &nbsp;(
          {formatNumber(ping, {
            style: 'unit',
            unit: 'second',
            maximumSignificantDigits: 2,
          })}
          )
        </>
      ),
    [ping, formatNumber],
  );

  const dotColor = (() => {
    if (!ping || !Number.isFinite(ping) || Number.isNaN(ping)) {
      return theme.pulsar.color.danger.normal;
    }

    if (ping > 1) {
      return theme.pulsar.color.warning.normal;
    }

    return theme.pulsar.color.success.normal;
  })();

  return (
    <>
      <FormattedMessage
        id="widget.node-selector.node-name"
        values={{
          nodeName: getNodeDisplayName(node),
          ping: pingString,
        }}
      />
      <FancyDot bg={dotColor} />
    </>
  );
};
