import {
  createFloat,
  createSwap,
  createWithdrawal,
  SkybridgeResource,
} from '@swingby-protocol/sdk';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { logger } from '../logger';
import { usePushWithSearchParams } from '../push-keeping-search';
import { useSdkContext } from '../store/sdkContext';
import { actionClearSwapFormData } from '../store/swapForm';
import { actionSetSwap } from '../store/swaps';

export const useCreate = ({ resource }: { resource: SkybridgeResource }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const context = useSdkContext();
  const addressReceiving = useSelector((state) => state.swapForm.addressReceiving);
  const currencyDeposit = useSelector((state) => state.swapForm.currencyDeposit);
  const currencyReceiving = useSelector((state) => state.swapForm.currencyReceiving);
  const amountDesired = useSelector((state) => state.swapForm.amountDesired);
  const affiliateCode = useSelector((state) => state.swapForm.affiliateCode);
  const dispatch = useDispatch();
  const { push } = usePushWithSearchParams();

  useEffect(() => {
    if (currencyReceiving && currencyDeposit && amountDesired) {
      setError(null);
    }
  }, [amountDesired, currencyDeposit, currencyReceiving]);

  const create = useCallback(async () => {
    setLoading(true);
    setError(null);

    logger.debug('Will call createSwap()', {
      addressReceiving,
      currencyDeposit,
      currencyReceiving,
      amountDesired,
      affiliateCode,
    });

    try {
      const getSwapHash = async () => {
        if (resource === 'swap') {
          const swap = await createSwap({
            context,
            amountDesired,
            currencyReceiving: currencyReceiving as any,
            currencyDeposit: currencyDeposit as any,
            addressReceiving,
            affiliateCode,
          });

          logger.debug('createSwap() has finished', swap);

          dispatch(actionClearSwapFormData());
          dispatch(actionSetSwap({ ...swap, status: 'WAITING' }));

          return swap;
        }

        if (resource === 'pool') {
          const swap = await createFloat({
            context,
            amountDesired,
            currencyDeposit: currencyDeposit as any,
            currencyReceiving: currencyReceiving as any,
            addressReceiving,
          });

          logger.debug('createFloat() has finished', swap);

          dispatch(actionClearSwapFormData());
          dispatch(actionSetSwap({ ...swap, status: 'WAITING' }));

          return swap;
        }

        if (resource === 'withdrawal') {
          const swap = await createWithdrawal({
            context,
            amountDesired,
            currencyDeposit: currencyDeposit as any,
            currencyReceiving: currencyReceiving as any,
            addressReceiving,
          });

          logger.debug('createWithdrawal() has finished', swap);

          dispatch(actionClearSwapFormData());
          dispatch(actionSetSwap({ ...swap, status: 'WAITING' }));

          return swap;
        }

        throw new Error(`Invalid action "${resource}"`);
      };

      const { hash } = await getSwapHash();

      push(`/${context.mode}/${resource}/${hash}`);
    } catch (err) {
      setError((err as any).message);
    } finally {
      setLoading(false);
    }
  }, [
    context,
    addressReceiving,
    currencyDeposit,
    currencyReceiving,
    amountDesired,
    push,
    dispatch,
    resource,
    affiliateCode,
  ]);

  return useMemo(() => ({ loading, create, error }), [create, loading, error]);
};
