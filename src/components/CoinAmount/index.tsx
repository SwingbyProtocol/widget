import { Loading, Testable, TextInput, useBuildTestId } from '@swingby-protocol/pulsar';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';
import { Big } from 'big.js';
import { useEffect, useMemo, useState, useCallback } from 'react';
import {
  estimateAmountReceiving,
  getCoinsFor,
  getSwapableFrom,
  SkybridgeResource,
  SkybridgeCoin,
  SkybridgeBridge,
  estimateSwapRewards,
  getSbbtcPrice,
} from '@swingby-protocol/sdk';

import { swingbyTextDisplay } from '../../modules/coin-map';
import { actionSetSwapFormData, useAreCurrenciesValid } from '../../modules/store/swapForm';
import { logger } from '../../modules/logger';
import { useSdkContext } from '../../modules/store/sdkContext';
import { rebalanceRewardsUrl } from '../../modules/env';
import { useDebounce } from '../../modules/use-debounce';

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
  SbBtcPriceNotation,
  SbBtcPriceNotationSmall,
  SbBtcPrice,
} from './styled';
import { CurrencySelector } from './CurrencySelector';

type Props = { variant: Variant; resource: SkybridgeResource } & Testable;

export const CoinAmount = ({ variant, resource, 'data-testid': testId }: Props) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  const { amountDesired, currencyDeposit, currencyReceiving } = useSelector(
    (state) => state.swapForm,
  );
  const dispatch = useDispatch();

  const [amountDesiredInput, setAmountDesiredInput] = useState('');
  const debounceAmountDesiredInput = useDebounce<string>(amountDesiredInput, 600);

  const [amountReceiving, setAmountReceiving] = useState('');
  const [feeTotal, setFeeTotal] = useState('');
  const [feeBridgePercent, setFeeBridgePercent] = useState('');
  const [rewardAmountReceiving, setRewardAmountReceiving] = useState('');
  const [rebateRate, setRebateRate] = useState('');
  const [isCalculating, setIsCalculating] = useState(false);
  const context = useSdkContext();
  const { areCurrenciesAndAmountValid, isAmountDesiredValid } = useAreCurrenciesValid({ resource });

  const [sbBtcPrice, setSbBtcPrice] = useState('');

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
    if (amountDesired) setAmountDesiredInput(amountDesired);
  }, [amountDesired, setAmountDesiredInput]);

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

  const handleChangeCurrencyDeposit = useCallback(
    (nextCurrencyDeposit: SkybridgeCoin) => {
      if (nextCurrencyDeposit === currencyDeposit) return;
      dispatch(actionSetSwapFormData({ currencyDeposit: nextCurrencyDeposit }));
    },
    [currencyDeposit, dispatch],
  );

  const handleChangeCurrencyReceiving = useCallback(
    (nextCurrencyReceiving: SkybridgeCoin) => {
      if (nextCurrencyReceiving === currencyReceiving) return;
      dispatch(actionSetSwapFormData({ currencyReceiving: nextCurrencyReceiving }));
    },
    [currencyReceiving, dispatch],
  );

  const handleChangeAmountDesiredInput = useCallback((evt: React.ChangeEvent<HTMLInputElement>) => {
    setAmountDesiredInput(evt.target.value);
  }, []);

  useEffect(() => {
    if (!debounceAmountDesiredInput) return;
    dispatch(actionSetSwapFormData({ amountDesired: debounceAmountDesiredInput }));
  }, [debounceAmountDesiredInput, dispatch]);

  useEffect(() => {
    getSbbtcPrice({ context, bridge: 'btc_skypool' }).then((price) => setSbBtcPrice(price));
  }, [context]);

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
        onChange={handleChangeCurrencyDeposit}
        data-testid={buildTestId('currency-from-select')}
      />
      <TextInput
        size="state"
        value={amountDesiredInput}
        onChange={handleChangeAmountDesiredInput}
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
            {resource === 'swap' && feeTotal !== '' && amountReceiving && (
              <>
                -{feeTotal}
                <br />
                <SwapFeeLabelSmall>({feeBridgePercent}% + miner fees)</SwapFeeLabelSmall>
              </>
            )}
            {resource !== 'swap' && amountReceiving && (
              <>
                -0.00000
                <br />
                <SwapFeeLabelSmall>(0.00% + miner fees)</SwapFeeLabelSmall>
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
        onChange={handleChangeCurrencyReceiving}
        data-testid={buildTestId('currency-to-select')}
      />
      <AmountReceiving data-testid={buildTestId('amount-to')}>
        {isCalculating ? (
          <Loading data-testid={buildTestId('amount-to.loading')} />
        ) : isAmountReceivingValid ? (
          <>
            <FormattedNumber value={Number(amountReceiving)} maximumFractionDigits={4} />
            {variant === 'vertical' &&
              resource === 'swap' &&
              !currencyDeposit.includes('sbBTC') &&
              rewardAmountReceiving !== '' && (
                <>
                  <br />
                  <RewardAmountReceiving variant={variant}>
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
            {variant === 'vertical' &&
              (resource !== 'swap' || currencyDeposit.includes('sbBTC')) &&
              [currencyDeposit, currencyReceiving].some((currency) =>
                currency.includes('sbBTC'),
              ) && (
                <>
                  <br />
                  <SbBtcPriceNotation variant={variant}>
                    sbBTC price =&nbsp;
                    <SbBtcPrice>
                      <FormattedNumber value={Number(sbBtcPrice)} maximumFractionDigits={6} />
                    </SbBtcPrice>
                    &nbsp;
                    {swingbyTextDisplay(
                      currencyDeposit.includes('sbBTC') ? currencyReceiving : currencyDeposit,
                    )}
                  </SbBtcPriceNotation>
                </>
              )}
          </>
        ) : null}
      </AmountReceiving>

      {variant === 'banner' && (
        <SwapFeeLabel variant={variant}>
          {resource === 'swap' && feeTotal !== '' && amountReceiving && (
            <SwapFeeLabelSmall>
              -{feeTotal}&nbsp;({feeBridgePercent}% + miner fees)
            </SwapFeeLabelSmall>
          )}
          {resource !== 'swap' && amountReceiving && (
            <SwapFeeLabelSmall>-0.00000&nbsp;(0.00% + miner fees)</SwapFeeLabelSmall>
          )}
        </SwapFeeLabel>
      )}
      {variant === 'banner' &&
        resource === 'swap' &&
        !currencyDeposit.includes('sbBTC') &&
        rewardAmountReceiving !== '' && (
          <RewardAmountReceiving variant={variant}>
            +
            <FormattedNumber value={Number(rewardAmountReceiving)} maximumFractionDigits={4} />
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
        )}
      {variant === 'banner' &&
        (resource !== 'swap' || currencyDeposit.includes('sbBTC')) &&
        [currencyDeposit, currencyReceiving].some((currency) => currency.includes('sbBTC')) &&
        amountReceiving && (
          <SbBtcPriceNotation variant={variant}>
            <SbBtcPriceNotationSmall>
              sbBTC price =&nbsp;
              <SbBtcPrice>
                <FormattedNumber value={Number(sbBtcPrice)} maximumFractionDigits={6} />
              </SbBtcPrice>
              &nbsp;
              {swingbyTextDisplay(
                currencyDeposit.includes('sbBTC') ? currencyReceiving : currencyDeposit,
              )}
            </SbBtcPriceNotationSmall>
          </SbBtcPriceNotation>
        )}
    </CoinAmountContainer>
  );
};
