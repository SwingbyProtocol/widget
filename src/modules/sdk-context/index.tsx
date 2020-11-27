import { buildContext, SwingbyContext } from '@swingby-protocol/sdk';
import React, { useContext, useEffect, useState } from 'react';

const SdkContext = React.createContext<SwingbyContext>((null as unknown) as SwingbyContext);

export const SdkContextProvider = ({ children }: { children?: React.ReactNode }) => {
  const [context, setContext] = useState<SwingbyContext | null>(null);

  useEffect(() => {
    (async () => {
      setContext(await buildContext({ mode: 'test' }));
    })();
  }, []);

  if (!context) {
    return null;
  }

  return <SdkContext.Provider value={context}>{children}</SdkContext.Provider>;
};

export const useSdkContext = () => useContext(SdkContext);
