import { SkybridgeTermsMessage } from '@swingby-protocol/sdk';
import { useCallback, useMemo } from 'react';
import Web3 from 'web3';

import { LocalStorage } from '../env';
import { logger } from '../logger';
import { useOnboard } from '../web3';

export const useAssertTermsSignature = () => {
  const { wallet, address } = useOnboard();

  const hasSignedTerms = async ({ address }: { address: string }): Promise<Boolean> => {
    const signedSignature = localStorage.getItem(LocalStorage.Terms);
    if (!signedSignature) return false;

    const { message } = SkybridgeTermsMessage;
    const web3 = new Web3();
    const signedAddress = web3.eth.accounts.recover(message, signedSignature);
    if (!signedAddress) return false;

    const checkSumAddress = web3.utils.toChecksumAddress(address);
    const recoveredCheckSumAddress = web3.utils.toChecksumAddress(signedAddress);

    return checkSumAddress === recoveredCheckSumAddress;
  };

  const assertTermsSignature = useCallback(async () => {
    if (!wallet || !address) {
      throw new Error('No wallet connected');
    }
    const isSigned = await hasSignedTerms({ address });

    if (isSigned) {
      return;
    }

    try {
      const { message, seed } = SkybridgeTermsMessage;
      if (!message || !seed) {
        throw new Error('No Terms of Service message found');
      }

      const web3 = new Web3(wallet.provider);
      const signature = await web3.eth.personal.sign(message, address, seed);
      localStorage.setItem(LocalStorage.Terms, signature);
    } catch (err) {
      logger.error({ err }, 'Error trying to get signature');
      throw err;
    }
  }, [address, wallet]);

  return useMemo(() => ({ assertTermsSignature }), [assertTermsSignature]);
};
