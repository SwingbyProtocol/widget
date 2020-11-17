import { useMatchMedia } from '@swingby-protocol/pulsar';
import React, { useEffect, useState, useLayoutEffect as _useLayoutEffect, useContext } from 'react';

import { StylingConstants } from '../styles';

const useLayoutEffect = typeof window !== 'undefined' ? _useLayoutEffect : useEffect;

type Layout = 'widget-banner' | 'widget-small' | 'widget-full' | 'website';

const WidgetLayoutContext = React.createContext<Layout>('widget-banner');

const useCalcWidgetLayout = (): Layout => {
  const [layout, setLayout] = useState<Layout>('widget-banner');
  const mediaSmall = useMatchMedia({ query: StylingConstants.mediaLayout.widgetSmall });
  const mediaFull = useMatchMedia({ query: StylingConstants.mediaLayout.widgetFull });
  const mediaWebsite = useMatchMedia({ query: StylingConstants.mediaLayout.website });

  useLayoutEffect(() => {
    if (!mediaSmall) {
      setLayout('widget-banner');
      return;
    }

    if (!mediaFull) {
      setLayout('widget-small');
      return;
    }

    if (!mediaWebsite) {
      setLayout('widget-full');
      return;
    }

    setLayout('website');
  }, [mediaSmall, mediaFull, mediaWebsite]);

  return layout;
};

export const WidgetLayoutProvider = ({ children }: { children: React.ReactNode }) => {
  const layout = useCalcWidgetLayout();
  return <WidgetLayoutContext.Provider value={layout}>{children}</WidgetLayoutContext.Provider>;
};

export const useWidgetLayout = () => useContext(WidgetLayoutContext);
