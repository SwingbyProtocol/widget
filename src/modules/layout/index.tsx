import { useEffect, useState, useLayoutEffect as _useLayoutEffect, useCallback } from 'react';

import { StylingConstants } from '../styles';

const useLayoutEffect = typeof window !== 'undefined' ? _useLayoutEffect : useEffect;

type Layout = 'widget-banner' | 'widget-small' | 'widget-full' | 'website';

export const useWidgetLayout = (): Layout => {
  const [layout, setLayout] = useState<Layout>('widget-banner');

  const updateState = useCallback(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    if (!window.matchMedia(StylingConstants.mediaLayout.widgetSmall).matches) {
      setLayout('widget-banner');
      return;
    }

    if (!window.matchMedia(StylingConstants.mediaLayout.widgetFull).matches) {
      setLayout('widget-small');
      return;
    }

    if (!window.matchMedia(StylingConstants.mediaLayout.website).matches) {
      setLayout('widget-full');
      return;
    }

    setLayout('website');
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const media = window.matchMedia(StylingConstants.mediaLayout.widgetSmall);

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
