import { useSelector } from 'react-redux';

export const useSdkContext = () => {
  return useSelector((state) => state.sdkContext);
};
