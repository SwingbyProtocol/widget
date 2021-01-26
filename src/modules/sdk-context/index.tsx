import { buildContext, SkybridgeMode, SkybridgeContext } from '@swingby-protocol/sdk';
import React, { useContext, useEffect, useState } from 'react';

const SdkContext = React.createContext<SkybridgeContext>((null as unknown) as SkybridgeContext);

export const SdkContextProvider = ({
  children,
  mode,
}: {
  children?: React.ReactNode;
  mode: SkybridgeMode;
}) => {
  const [context, setContext] = useState<SkybridgeContext | null>(null);

  useEffect(() => {
    (async () => {
      const context = await buildContext({ mode });
      setContext({ ...context, affiliateApi: window.location.origin });
    })();
  }, [mode]);

  if (!context) {
    return null;
  }

  return <SdkContext.Provider value={context}>{children}</SdkContext.Provider>;
};

export const useSdkContext = () => useContext(SdkContext);
