import { useCallback, useMemo } from 'react';
import Web3 from 'web3';

import {
  useHasSignedTermsQuery,
  useSignTermsMutation,
  useTermsMessageQuery,
} from '../../../generated/graphql';
import { logger } from '../../logger';
import { useOnboard } from '../../web3';

/*
 * Store the signature data who signed on Terms of Use.
 * To recover from signature(hex) -> await web3.eth.personal.ecRecover(SIGNATURE_MESSAGE, signature)
 *  >> returns signed `wallet address`.
 *  !! MUST use same wallet.provider (same address?) to make web3 instance. const web3 = new Web3(wallet.provider)
 *
 * Fixme: Getting error when use 'Ledger' option with `Ethereum Ledger Live -m/44'/60'` derivation path
 * name: "TransportError", message: "Ledger Device is busy (lock getAddress)
 * Could be an error on 'Ledger Live App'.
 */

export const useGetSignature = () => {
  const { onboard, wallet, address } = useOnboard();
  const { data: msgData } = useTermsMessageQuery();
  const [signTerms] = useSignTermsMutation();
  const { data: addressTerms, refetch } = useHasSignedTermsQuery({
    variables: {
      address: address!,
    },
  });

  const getSignature = useCallback(async () => {
    if (!msgData || !wallet || !address || !onboard) return;
    const message = msgData.termsMessage.message;
    const seed = msgData.termsMessage.seed;
    try {
      const web3 = new Web3(wallet.provider);
      const signature = await web3.eth.personal.sign(message, address, seed);
      await signTerms({ variables: { address, signature } });
      await refetch();
      return signature;
    } catch (e) {
      logger.error('Error trying to get signature', e);
      return false;
    }
  }, [address, wallet, onboard, msgData, signTerms, refetch]);

  return useMemo(() => ({ addressTerms, getSignature }), [addressTerms, getSignature]);
};
