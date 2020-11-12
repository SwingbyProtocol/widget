import { useMemo } from 'react';
import { DefaultRootState, useSelector } from 'react-redux';

export const isReceivingAddressValid = (state: DefaultRootState['formAddress']): boolean => {
  return !!state.receivingAddress;
};

export const useIsReceivingAddressValid = () => {
  const data = useSelector((state) => state.formAddress);
  return useMemo(() => ({ isFormDataValid: isReceivingAddressValid(data) }), [data]);
};
