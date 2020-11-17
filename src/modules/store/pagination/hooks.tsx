import { useMemo } from 'react';
import { DefaultRootState, useDispatch } from 'react-redux';

import { actionSetPagination } from './reducer';

export const useSetStep = () => {
  const dispatch = useDispatch();
  return useMemo(() => {
    return {
      setStep: (step: DefaultRootState['pagination']['step']) => {
        dispatch(actionSetPagination({ step }));
      },
    };
  }, [dispatch]);
};
