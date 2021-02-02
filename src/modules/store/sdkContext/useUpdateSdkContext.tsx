import type { SkybridgeContext } from '@swingby-protocol/sdk';
import { useMemo } from 'react';
import { useDispatch } from 'react-redux';

import { actionSetSdkContext } from './reducer';

export const useUpdateSdkContext = () => {
  const dispatch = useDispatch();
  return useMemo(
    () => ({
      updateSdkContext: (context: SkybridgeContext) => {
        dispatch(actionSetSdkContext(context));
      },
    }),
    [dispatch],
  );
};
