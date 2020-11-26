import { Loading, Testable, TextInput, useBuildTestId } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { buildContext, estimateAmountOut } from '@swingby-protocol/sdk';

import { actionSetSwapData } from '../../modules/store/swap';
import { logger } from '../../modules/logger';

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
  const { amountUser, currencyIn, currencyOut } = useSelector((state) => state.swap);
  const dispatch = useDispatch();
  const [amountOut, setAmountOut] = useState('0');
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (cancelled) return;
        setIsCalculating(true);

        if (cancelled) return;
        const context = await buildContext({ mode: 'test' });

        if (cancelled) return;
        const { amountOut } = await estimateAmountOut({
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
        variant={variant}
        value={currencyIn}
        onChange={(currencyIn) => dispatch(actionSetSwapData({ currencyIn }))}
        data-testid={buildTestId('currency-from-select')}
      />
      <TextInput
        size="state"
        value={amountUser}
        onChange={(evt) => dispatch(actionSetSwapData({ amountUser: evt.target.value }))}
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
        except={currencyIn}
        onChange={(currencyOut) => dispatch(actionSetSwapData({ currencyOut }))}
        data-testid={buildTestId('currency-to-select')}
      />
      <AmountOut data-testid={buildTestId('amount-to')}>
        {isCalculating ? <Loading /> : amountOut}
      </AmountOut>
    </CoinAmountContainer>
  );
};
