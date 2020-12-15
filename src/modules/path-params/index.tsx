import { isSkybridgeMode, isSkybridgeResource } from '@swingby-protocol/sdk';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

export const useWidgetPathParams = () => {
  const {
    query: { resource, mode, hash },
  } = useRouter();

  return useMemo(
    () => ({
      resource: isSkybridgeResource(resource) ? resource : undefined,
      mode: isSkybridgeMode(mode) ? mode : undefined,
      hash: typeof hash === 'string' ? hash : undefined,
    }),
    [resource, mode, hash],
  );
};
