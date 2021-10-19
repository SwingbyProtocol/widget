import { useCallback, useEffect, useMemo } from 'react';
import Web3 from 'web3';

import {
  useHasSignedTermsLazyQuery,
  useSignTermsMutation,
  useTermsMessageQuery,
} from '../../../generated/graphql';
import { logger } from '../../logger';
import { useOnboard } from '../../web3';

export const useGetSignature = () => {
  const { onboard, wallet, address } = useOnboard();
  const { data: msgData } = useTermsMessageQuery();
  const [signTerms] = useSignTermsMutation();
  const [fetchTerms, { data }] = useHasSignedTermsLazyQuery();

  const checkTermsSignature = useCallback(async () => {
    if (!msgData || !wallet || !address || !onboard) return;

    const message = msgData.termsMessage.message;
    const seed = msgData.termsMessage.seed;
    try {
      if (!data || data.hasSignedTerms) return;

      if (!data.hasSignedTerms) {
        const web3 = new Web3(wallet.provider);
        const signature = await web3.eth.personal.sign(message, address, seed);
        await signTerms({ variables: { address, signature } });
      }
    } catch (e) {
      logger.error({ err: e }, 'Error trying to get signature');
      throw e;
    }
  }, [address, wallet, onboard, msgData, signTerms, data]);

  useEffect(() => {
    if (!address) return;
    fetchTerms({ variables: { address } });
  }, [fetchTerms, address]);

  return useMemo(() => ({ checkTermsSignature, fetchTerms }), [checkTermsSignature, fetchTerms]);
};
