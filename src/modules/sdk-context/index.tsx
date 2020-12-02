import { buildContext, Mode, SwingbyContext } from '@swingby-protocol/sdk';
import React, { useContext, useEffect, useState } from 'react';

const SdkContext = React.createContext<SwingbyContext>((null as unknown) as SwingbyContext);

export const SdkContextProvider = ({
  children,
  mode,
}: {
  children?: React.ReactNode;
  mode: Mode;
}) => {
  const [context, setContext] = useState<SwingbyContext | null>(null);

  useEffect(() => {
    (async () => {
      setContext(await buildContext({ mode }));
    })();
  }, [mode]);

  if (!context) {
    return null;
  }

  return <SdkContext.Provider value={context}>{children}</SdkContext.Provider>;
};

export const useSdkContext = () => useContext(SdkContext);
