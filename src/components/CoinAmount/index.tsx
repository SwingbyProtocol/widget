import { Loading, Testable, TextInput, useBuildTestId } from '@swingby-protocol/pulsar';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Big } from 'big.js';
import { useEffect, useMemo, useState } from 'react';
import {
  getCoinsFor,
  getSwapableFrom,
  SkybridgeResource,
  SkybridgeCoin,
  estimateAmountReceiving,
} from '@swingby-protocol/sdk';

import { actionSetSwapFormData, useAreCurrenciesValid } from '../../modules/store/swapForm';
import { logger } from '../../modules/logger';
import { useSdkContext } from '../../modules/store/sdkContext';

import {
  CoinAmountContainer,
  Label,
  SwapVertical,
  SwapHorizontal,
  Variant,
  AmountReceiving,
  EstLabel,
} from './styled';
import { CurrencySelector } from './CurrencySelector';

type Props = { variant: Variant; resource: SkybridgeResource } & Testable;

export const CoinAmount = ({ variant, resource, 'data-testid': testId }: Props) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  const { amountDesired, currencyDeposit, currencyReceiving } = useSelector(
    (state) => state.swapForm,
  );
  const dispatch = useDispatch();
  const [amountReceiving, setAmountReceiving] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const context = useSdkContext();
  const { areCurrenciesAndAmountValid, isAmountDesiredValid } = useAreCurrenciesValid({ resource });

  const coinsIn = useMemo<SkybridgeCoin[]>(
    () => getCoinsFor({ context, resource, direction: 'in' }),
    [context, resource],
  );

  const coinsOut = useMemo<SkybridgeCoin[]>(
    () =>
      getSwapableFrom({ context, coin: currencyDeposit, resource }).filter(
        (it) => it !== currencyDeposit,
      ),
    [context, resource, currencyDeposit],
  );

  useEffect(() => {
    if (coinsIn.includes(currencyDeposit)) return;
    dispatch(actionSetSwapFormData({ currencyDeposit: coinsIn[0] ?? 'BTC' }));
  }, [coinsIn, currencyDeposit, dispatch]);

  useEffect(() => {
    if (coinsOut.includes(currencyReceiving)) return;
    dispatch(actionSetSwapFormData({ currencyReceiving: coinsOut[0] ?? 'BTC' }));
  }, [coinsOut, currencyReceiving, dispatch]);

  useEffect(() => {
    if (!areCurrenciesAndAmountValid) {
      setAmountReceiving('');
      setIsCalculating(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setIsCalculating(true);

        if (cancelled) return;
        const { amountReceiving } = await estimateAmountReceiving({
          context,
          amountDesired,
          currencyDeposit,
          currencyReceiving,
        });

        if (cancelled) return;
        setAmountReceiving(amountReceiving);
      } catch (err) {
        logger.error({ err });

        if (cancelled) return;
        setAmountReceiving('');
      } finally {
        setIsCalculating(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [areCurrenciesAndAmountValid, context, amountDesired, currencyDeposit, currencyReceiving]);

  const isAmountReceivingValid = useMemo(() => {
    try {
      new Big(amountReceiving);
      return true;
    } catch (err) {
      return false;
    }
  }, [amountReceiving]);

  const reverseCurrency = () => {
    dispatch(actionSetSwapFormData({ currencyDeposit: currencyReceiving }));
    dispatch(actionSetSwapFormData({ currencyReceiving: currencyDeposit }));
  };

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
        value={currencyDeposit}
        onChange={(currencyDeposit) => dispatch(actionSetSwapFormData({ currencyDeposit }))}
        data-testid={buildTestId('currency-from-select')}
      />
      <TextInput
        size="state"
        value={amountDesired}
        onChange={(evt) => dispatch(actionSetSwapFormData({ amountDesired: evt.target.value }))}
        data-testid={buildTestId('amount-from')}
        state={isAmountDesiredValid ? 'normal' : 'danger'}
      />
      {variant === 'vertical' && <Label />}
      {variant === 'banner' ? (
        <SwapHorizontal onClick={reverseCurrency} />
      ) : (
        <SwapVertical onClick={reverseCurrency} />
      )}
      {variant === 'vertical' && (
        <Label>
          <FormattedMessage id="widget.to" />
        </Label>
      )}
      <CurrencySelector
        variant={variant}
        value={currencyReceiving}
        coins={coinsOut}
        onChange={(currencyReceiving) => dispatch(actionSetSwapFormData({ currencyReceiving }))}
        data-testid={buildTestId('currency-to-select')}
      />
      <AmountReceiving data-testid={buildTestId('amount-to')}>
        {isCalculating ? (
          <Loading data-testid={buildTestId('amount-to.loading')} />
        ) : isAmountReceivingValid ? (
          <>
            <FormattedNumber value={Number(amountReceiving)} maximumFractionDigits={4} />
            <EstLabel>
              <FormattedMessage id="widget.amount-receiving-estimation-label" />
            </EstLabel>
          </>
        ) : null}
      </AmountReceiving>
    </CoinAmountContainer>
  );
};
