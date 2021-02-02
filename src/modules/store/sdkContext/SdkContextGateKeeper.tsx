import { buildContext, SkybridgeMode } from '@swingby-protocol/sdk';
import React, { useEffect } from 'react';

import { useSdkContext } from './useSdkContext';
import { useUpdateSdkContext } from './useUpdateSdkContext';

export const SdkContextGateKeeper = ({
  children,
  mode,
}: {
  children?: React.ReactNode;
  mode: SkybridgeMode;
}) => {
  const currentContext = useSdkContext();
  const { updateSdkContext } = useUpdateSdkContext();

  useEffect(() => {
    if (currentContext) {
      return;
    }

    (async () => {
      updateSdkContext(await buildContext({ mode }));
    })();
  }, [currentContext, updateSdkContext, mode]);

  if (!currentContext) {
    return <>{null}</>;
  }

  return <>{children}</>;
};
