import { useRouter } from 'next/router';

export const useSwapHash = () => {
  const {
    query: { hash: swapHashParam },
  } = useRouter();

  return typeof swapHashParam === 'string' ? swapHashParam : '';
};
