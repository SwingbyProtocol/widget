import { useTheme } from 'styled-components';
import { useMeasure } from 'react-use';
import { useMemo } from 'react';

const dashWidth = 4;
const dashOffset = -2;

const defaultDashCount = 20;
const defaultWidth = 365;

export const Separator = () => {
  const theme = useTheme();
  const [ref, { width }] = useMeasure();

  const strokeDasharray = useMemo(() => {
    const dashCount = Math.ceil((width * defaultDashCount) / defaultWidth);
    const spaceCount = dashCount - 1;

    const spaceWidth = (width - Math.abs(dashOffset * 2) - dashWidth * dashCount) / spaceCount;
    return [dashWidth, spaceWidth].join(',');
  }, [width]);

  return (
    <svg width="100%" height="3px" xmlns="http://www.w3.org/2000/svg" ref={ref as any}>
      <line
        x1="0"
        y1="1.5"
        x2="100%"
        y2="1.5"
        fill="none"
        stroke={theme.pulsar.color.border.normal}
        strokeWidth="3px"
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
        strokeDashoffset={dashOffset}
      />
    </svg>
  );
};
