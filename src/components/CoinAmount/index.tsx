import { Loading, Testable, TextInput, useBuildTestId } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useMemo, useState } from 'react';
import {
  buildContext,
  estimateSwapAmountOut,
  getCoinsFor,
  getSwapableWith,
} from '@swingby-protocol/sdk';

import { actionSetSwapFormData } from '../../modules/store/swapForm';
import { logger } from '../../modules/logger';
import { useSdkContext } from '../../modules/sdk-context';

import {
  CoinAmountContainer,
  Label,
  SwapVertical,
  SwapHorizontal,
  Variant,
  AmountOut,
} from './styled';
import { CurrencySelector } from './CurrencySelector';

type Props = { variant: Variant } & Testable;

export const CoinAmount = ({ variant, 'data-testid': testId }: Props) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  const { amountUser, currencyIn, currencyOut } = useSelector((state) => state.swapForm);
  const dispatch = useDispatch();
  const [amountOut, setAmountOut] = useState('0');
  const [isCalculating, setIsCalculating] = useState(false);
  const context = useSdkContext();

  const coinsIn = useMemo(() => getCoinsFor({ context }), [context]);

  const coinsOut = useMemo(() => getSwapableWith({ context, coin: currencyIn }), [
    context,
    currencyIn,
  ]);

  useEffect(() => {
    if ((coinsOut as string[]).includes(currencyOut)) return;
    dispatch(actionSetSwapFormData({ currencyOut: coinsOut[0] ?? 'BTC' }));
  }, [coinsOut, currencyOut, dispatch]);

  useEffect(() => {
    if (currencyIn === 'sbBTC' || currencyOut === 'sbBTC') return;

    let cancelled = false;

    (async () => {
      try {
        if (cancelled) return;
        setIsCalculating(true);

        if (cancelled) return;
        const context = await buildContext({ mode: 'test' });

        if (cancelled) return;
        const { amountOut } = await estimateSwapAmountOut({
          context,
          amountUser,
          currencyIn,
          currencyOut,
        });

        if (cancelled) return;
        setAmountOut(amountOut);
      } catch (e) {
        logger.error(e);

        if (cancelled) return;
        setAmountOut('0');
      } finally {
        setIsCalculating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [amountUser, currencyIn, currencyOut]);

  return (
    <CoinAmountContainer variant={variant} data-testid={buildTestId('')}>
      {variant === 'vertical' && (
        <Label>
          <FormattedMessage id="widget.from" />
        </Label>
      )}
      <CurrencySelector
        coins={coinsIn}
        variant={variant}
        value={currencyIn}
        onChange={(currencyIn) => dispatch(actionSetSwapFormData({ currencyIn }))}
        data-testid={buildTestId('currency-from-select')}
      />
      <TextInput
        size="state"
        value={amountUser}
        onChange={(evt) => dispatch(actionSetSwapFormData({ amountUser: evt.target.value }))}
        data-testid={buildTestId('amount-from')}
      />
      {variant === 'vertical' && <Label />}
      {variant === 'banner' ? <SwapHorizontal /> : <SwapVertical />}
      {variant === 'vertical' && (
        <Label>
          <FormattedMessage id="widget.to" />
        </Label>
      )}
      <CurrencySelector
        variant={variant}
        value={currencyOut}
        coins={coinsOut}
        onChange={(currencyOut) => dispatch(actionSetSwapFormData({ currencyOut }))}
        data-testid={buildTestId('currency-to-select')}
      />
      <AmountOut data-testid={buildTestId('amount-to')}>
        {isCalculating ? <Loading /> : amountOut}
      </AmountOut>
    </CoinAmountContainer>
  );
};
