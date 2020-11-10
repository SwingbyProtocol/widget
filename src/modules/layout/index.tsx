import { useEffect, useState, useLayoutEffect as _useLayoutEffect, useCallback } from 'react';
import { em } from 'polished';

import { StylingConstants } from '../styles';

const useLayoutEffect = typeof window !== 'undefined' ? _useLayoutEffect : useEffect;
const queryMedium = `(min-height: ${em(StylingConstants.mediaHeight.medium)})`;
const queryBig = `(min-height: ${em(StylingConstants.mediaHeight.big)})`;
const queryMassive = `(min-height: ${em(StylingConstants.mediaHeight.massive)})`;

type Layout = 'small' | 'medium' | 'big' | 'massive';

export const useWidgetLayout = (): Layout => {
  const [layout, setLayout] = useState<Layout>('small');

  const updateState = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    if (!window.matchMedia(queryMedium).matches) {
      setLayout('small');
      return;
    }

    if (!window.matchMedia(queryBig).matches) {
      setLayout('medium');
      return;
    }

    if (!window.matchMedia(queryMassive).matches) {
      setLayout('big');
      return;
    }

    setLayout('massive');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const media = window.matchMedia(queryMedium);

    if (media.addEventListener) {
      media.addEventListener('change', updateState);
      return () => media.removeEventListener('change', updateState);
    }

    media.addListener(updateState);
    return () => media.removeListener(updateState);
  }, [updateState]);

  useLayoutEffect(() => {
    updateState();
  }, [updateState]);

  return layout;
};
