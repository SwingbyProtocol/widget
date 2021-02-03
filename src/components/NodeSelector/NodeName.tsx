import { Duration } from 'luxon';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useTheme } from 'styled-components';

import { getNodeDisplayName } from './getNodeDisplayName';
import { FancyDot } from './styled';

type Props = { node: string | null; pingMs: number | null | undefined };

export const NodeName = ({ node, pingMs }: Props) => {
  const { formatNumber } = useIntl();
  const theme = useTheme();

  const ping = useMemo(() => {
    if (!pingMs || !Number.isFinite(pingMs) || Number.isNaN(pingMs)) {
      return null;
    }

    return Duration.fromObject({ milliseconds: pingMs });
  }, [pingMs]);

  const pingString = useMemo(() => {
    if (!ping) return null;
    const unit = ping.as('seconds') < 1 ? 'millisecond' : 'second';
    return (
      <>
        &nbsp;(
        {formatNumber(ping.as(unit), {
          style: 'unit',
          unit,
          maximumFractionDigits: 1,
          maximumSignificantDigits: 2,
          notation: 'compact',
        })}
        )
      </>
    );
  }, [ping, formatNumber]);

  const dotColor = (() => {
    if (!ping) {
      return theme.pulsar.color.danger.normal;
    }

    if (ping.as('seconds') >= 1) {
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
