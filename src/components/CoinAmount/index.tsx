import { Loading, Testable, TextInput, useBuildTestId } from '@swingby-protocol/pulsar';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Big } from 'big.js';
import { useEffect, useMemo, useState } from 'react';
import {
  estimateAmountReceiving,
  getCoinsFor,
  getSwapableFrom,
  SkybridgeResource,
  SkybridgeCoin,
  SkybridgeBridge,
  estimateSwapRewards,
} from '@swingby-protocol/sdk';

import { actionSetSwapFormData, useAreCurrenciesValid } from '../../modules/store/swapForm';
import { logger } from '../../modules/logger';
import { useSdkContext } from '../../modules/store/sdkContext';
import { rebalanceRewardsUrl } from '../../modules/env';

import {
  CoinAmountContainer,
  Label,
  SwapVertical,
  SwapHorizontal,
  Variant,
  AmountReceiving,
  SwapFeeLabel,
  SwapFeeLabelSmall,
  RewardAmountReceiving,
  RewardAmountReceivingSmall,
  Atag,
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
  const [feeTotal, setFeeTotal] = useState('');
  const [feeBridgePercent, setFeeBridgePercent] = useState('');
  const [rewardAmountReceiving, setRewardAmountReceiving] = useState('');
  const [rebateRate, setRebateRate] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const context = useSdkContext();
  const { areCurrenciesAndAmountValid, isAmountDesiredValid } = useAreCurrenciesValid({ resource });

  const coinsIn = useMemo<SkybridgeCoin[]>(
    () =>
      getCoinsFor({ context, resource, direction: 'in', bridge: 'btc_skypool' as SkybridgeBridge }),
    [context, resource],
  );

  const coinsOut = useMemo<SkybridgeCoin[]>(
    () =>
      getSwapableFrom({
        context,
        coin: currencyDeposit,
        resource,
        bridge: 'btc_skypool' as SkybridgeBridge,
      }).filter((it) => it !== currencyDeposit),
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
      setRewardAmountReceiving('');
      setFeeTotal('');
      setIsCalculating(false);
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        setAmountReceiving('');
        setRewardAmountReceiving('');
        setFeeTotal('');
        setIsCalculating(true);

        if (cancelled) return;

        const { amountReceiving, feeTotal, feeBridgeFraction } = await estimateAmountReceiving({
          context,
          amountDesired,
          currencyDeposit,
          currencyReceiving,
        });

        if (cancelled) return;

        const feeBridgePercent = new Intl.NumberFormat('en-US', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 18,
        }).format(parseFloat(feeBridgeFraction) * 100);

        setAmountReceiving(amountReceiving);
        if (parseFloat(feeTotal)) {
          setFeeTotal(feeTotal);
          setFeeBridgePercent(feeBridgePercent);
        }

        if (currencyDeposit !== 'sbBTC.SKYPOOL') {
          const { amountReceiving: rewardAmountReceiving, rebateRate } = await estimateSwapRewards({
            context,
            amountDesired,
            currencyDeposit,
            currencyReceiving,
          });

          if (cancelled) return;

          if (parseFloat(rewardAmountReceiving)) {
            const rebateRatePercent = new Intl.NumberFormat('en-US', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 18,
            }).format(parseFloat(rebateRate) / 100);

            setRewardAmountReceiving(rewardAmountReceiving);
            setRebateRate(rebateRatePercent);
          }
        }
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
        <>
          <SwapVertical onClick={reverseCurrency} />
          <SwapFeeLabel variant={variant}>
            {feeTotal !== '' && (
              <>
                -{feeTotal}
                <br />
                <SwapFeeLabelSmall>({feeBridgePercent}% + network fees)</SwapFeeLabelSmall>
              </>
            )}
          </SwapFeeLabel>
        </>
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
            {rewardAmountReceiving !== '' && (
              <>
                <br />
                <RewardAmountReceiving>
                  +
                  <FormattedNumber
                    value={Number(rewardAmountReceiving)}
                    maximumFractionDigits={4}
                  />
                  &nbsp;SWINGBY
                  <br />
                  <RewardAmountReceivingSmall>
                    ({rebateRate}%{' '}
                    <Atag href={rebalanceRewardsUrl} rel="noopener noreferrer" target="_blank">
                      rebalance rewards
                    </Atag>
                    )
                  </RewardAmountReceivingSmall>
                </RewardAmountReceiving>
              </>
            )}
          </>
        ) : null}
      </AmountReceiving>

      {variant === 'banner' && (
        <SwapFeeLabel variant={variant}>
          {feeTotal !== '' && (
            <SwapFeeLabelSmall>
              -{feeTotal}&nbsp;({feeBridgePercent}% + network fees)
            </SwapFeeLabelSmall>
          )}
        </SwapFeeLabel>
      )}
    </CoinAmountContainer>
  );
};
