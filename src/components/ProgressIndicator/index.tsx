import { logos, getCoinLogo } from '@swingby-protocol/pulsar';
import { Coin } from '@swingby-protocol/sdk';
import { useMemo } from 'react';
import { useTheme } from 'styled-components';

const STATUSES = ['awaiting-deposit', 'processing-swap', 'sending-swap', 'completed'] as const;
type Status = typeof STATUSES[number];

export const ProgressIndicator = ({
  status,
  currencyFrom,
  currencyTo,
  className,
}: {
  status: Status;
  currencyFrom: Coin;
  currencyTo: Coin;
  className?: string;
}) => {
  const theme = useTheme();
  const logoFrom = useMemo(() => getCoinLogo({ symbol: currencyFrom }), [currencyFrom]);
  const logoTo = useMemo(() => getCoinLogo({ symbol: currencyTo }), [currencyTo]);

  const completedColor = theme.pulsar.color.primary.normal;
  const pendingColor = theme.pulsar.color.border.normal;
  const stepIndex = STATUSES.indexOf(status);

  return (
    <svg className={className} viewBox="0 0 251 55" fill="none" xmlns="http://www.w3.org/2000/svg">
      <image x="7" y="7" width="41" height="41" href={logoFrom} />
      <image x="104" y="7" width="41" height="41" href={logos.SwingbyFlat} />
      <image x="203" y="7" width="41" height="41" href={logoTo} />

      <circle
        cx="27.5"
        cy="27.5"
        r="26.5"
        stroke={stepIndex >= 0 ? completedColor : pendingColor}
        stroke-width="2"
      />
      <rect
        x="53"
        y="27"
        width="46"
        height="2"
        fill={stepIndex >= 1 ? completedColor : pendingColor}
      />
      <rect
        x="53"
        y="27"
        width="23"
        height="2"
        fill={stepIndex >= 0 ? completedColor : pendingColor}
      />

      <circle
        cx="124.5"
        cy="27.5"
        r="26.5"
        stroke={stepIndex >= 1 ? completedColor : pendingColor}
        stroke-width="2"
      />
      <rect
        x="152"
        y="27"
        width="46"
        height="2"
        fill={stepIndex >= 3 ? completedColor : pendingColor}
      />
      <rect
        x="152"
        y="27"
        width="23"
        height="2"
        fill={stepIndex >= 2 ? completedColor : pendingColor}
      />

      <circle
        cx="223.5"
        cy="27.5"
        r="26.5"
        stroke={stepIndex >= 3 ? completedColor : pendingColor}
        stroke-width="2"
      />
    </svg>
  );
};