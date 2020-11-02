import { useEffect, useState, useLayoutEffect as _useLayoutEffect } from 'react';
import { em } from 'polished';

import { StylingConstants } from '../styles';

type Layout = 'vertical' | 'horizontal';

const useLayoutEffect = typeof window !== 'undefined' ? _useLayoutEffect : useEffect;
const query = `(min-height: ${em(StylingConstants.media.medium)})`;

export const useWidgetLayout = (): Layout => {
  const [layout, setLayout] = useState<Layout>('vertical');

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const media = window.matchMedia(query);
    const listener = ({ matches }: MediaQueryListEvent) => {
      setLayout(matches ? 'vertical' : 'horizontal');
    };

    if (media.addEventListener) {
      media.addEventListener('change', listener);
      return () => media.removeEventListener('change', listener);
    }

    media.addListener(listener);
    return () => media.removeListener(listener);
  }, []);

  useLayoutEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    if (window.matchMedia(query).matches) {
      setLayout('vertical');
    } else {
      setLayout('horizontal');
    }
  }, [setLayout]);

  return layout;
};
