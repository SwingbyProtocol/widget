import { calculateSwap, createSwap } from '@swingby-protocol/sdk';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { logger } from '../../logger';
import { useSdkContext } from '../../sdk-context';

import { actionSetSwapData } from './reducer';

export const useCreateSwap = () => {
  const context = useSdkContext();
  const addressOut = useSelector((state) => state.swap.addressOut);
  const currencyIn = useSelector((state) => state.swap.currencyIn);
  const currencyOut = useSelector((state) => state.swap.currencyOut);
  const amountUser = useSelector((state) => state.swap.amountUser);
  const dispatch = useDispatch();

  return useMemo(
    () => ({
      createSwap: async () => {
        logger.debug('Will call calculateSwap()', {
          addressOut,
          currencyIn,
          currencyOut,
          amountUser,
        });

        const { amountIn, nonce } = await calculateSwap({
          context,
          amountUser,
          addressOut,
          currencyIn,
          currencyOut,
        });

        logger.debug('calculateSwap() has finished', { amountIn, nonce });
        logger.debug('Will call createSwap()');

        const { addressIn, timestamp } = await createSwap({
          context,
          nonce,
          amountIn,
          currencyOut,
          currencyIn,
          addressOut,
        });

        logger.debug('createSwap() has finished', { addressIn, timestamp });

        dispatch(actionSetSwapData({ amountIn, addressIn }));
      },
    }),
    [context, addressOut, currencyIn, currencyOut, amountUser, dispatch],
  );
};
