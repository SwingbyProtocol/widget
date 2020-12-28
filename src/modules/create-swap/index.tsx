import {
  createFloat,
  createSwap,
  createWithdrawal,
  SkybridgeResource,
} from '@swingby-protocol/sdk';
import { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { logger } from '../logger';
import { usePushWithSearchParams } from '../push-keeping-search';
import { useSdkContext } from '../sdk-context';
import { actionClearSwapFormData } from '../store/swapForm';
import { actionSetSwap } from '../store/swaps';

export const useCreate = ({ resource }: { resource: SkybridgeResource }) => {
  const [loading, setLoading] = useState(false);
  const context = useSdkContext();
  const addressReceiving = useSelector((state) => state.swapForm.addressReceiving);
  const currencyDeposit = useSelector((state) => state.swapForm.currencyDeposit);
  const currencyReceiving = useSelector((state) => state.swapForm.currencyReceiving);
  const amountDesired = useSelector((state) => state.swapForm.amountDesired);
  const dispatch = useDispatch();
  const { push } = usePushWithSearchParams();

  const create = useCallback(async () => {
    setLoading(true);

    logger.debug('Will call createSwap()', {
      addressReceiving,
      currencyDeposit,
      currencyReceiving,
      amountDesired,
    });

    try {
      const { hash } = await (async () => {
        if (resource === 'swap') {
          const swap = await createSwap({
            context,
            amountDesired,
            currencyReceiving: currencyReceiving as any,
            currencyDeposit: currencyDeposit as any,
            addressReceiving,
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
            currencyReceiving: currencyReceiving as any,
            addressReceiving,
          });

          logger.debug('createWithdrawal() has finished', swap);

          dispatch(actionClearSwapFormData());
          dispatch(actionSetSwap({ ...swap, status: 'WAITING' }));

          return swap;
        }

        throw new Error(`Invalid action "${resource}"`);
      })();

      push(`/${context.mode}/${resource}/${hash}`);
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
  ]);

  return useMemo(() => ({ loading, create }), [create, loading]);
};
