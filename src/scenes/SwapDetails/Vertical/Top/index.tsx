import {
  CoinIcon,
  CopyToClipboard,
  getCryptoAssetFormatter,
  Icon,
  Testable,
  Tooltip,
  useBuildTestId,
} from '@swingby-protocol/pulsar';
import { FormattedMessage, FormattedNumber, useIntl } from 'react-intl';
import { DefaultRootState } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInterval } from 'react-use';

import { FancyCryptoAmount } from '../../../../components/FancyCryptoAmount';
import { Space } from '../../../../components/Space';
import { useWidgetLayout } from '../../../../modules/layout';
import { useSbBTCPrice } from '../../../../modules/web3';

import { BigText, SmallText, CoinWithText, Container, FeeText } from './styled';

export const Top = ({
  swap,
  'data-testid': testId,
}: Testable & { swap: NonNullable<DefaultRootState['swaps'][string]> }) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  const { locale, formatMessage } = useIntl();
  const layout = useWidgetLayout();
  const { getCurrentPrice } = useSbBTCPrice();
  const spaceSize = layout === 'widget-full' || layout === 'website' ? 'house' : 'room';
  const smallSpaceSize = layout === 'widget-full' || layout === 'website' ? 'closet' : 'drawer';
  const copyToClipboardSize = layout === 'widget-full' || layout === 'website' ? 'city' : 'town';
  const sendExactlyNote = formatMessage({ id: 'widget.status-label-long.WAITING.note' });

  const [sbBTCPrice, setCurrencyPrice] = useState(1);
  const asyncGetPrice = useCallback(async () => {
    // If is not sbBTC.SKYPOOL the conversion rate is not used
    if (swap.currencyDeposit !== 'sbBTC.SKYPOOL') return;
    try {
      const price = await getCurrentPrice();
      setCurrencyPrice(price['sbBTC.SKYPOOL'].priceSbBTC);
    } catch (e) {
      console.warn(e);
    }
  }, [getCurrentPrice, swap]);

  useEffect(() => {
    asyncGetPrice();
  }, [asyncGetPrice]);

  useInterval(() => asyncGetPrice(), 10 * 1000);

  const receivedAmount = useMemo(() => {
    // If is not sbBTC.SKYPOOL the conversion rate is not used, just rendered what swap said
    if (swap.currencyDeposit !== 'sbBTC.SKYPOOL') return +(swap.amountReceiving ?? 0);
    // Currently we have 0.2% fees of withdraw liquidity
    // Just apply this logic to sbBTC.SKYPOOL
    // We use the amountDeposit as base since the amountReceiving is wrong from the api
    else return +(+(swap.amountDeposit ?? 0) * sbBTCPrice * (1 - 0.002)).toFixed(7);
  }, [sbBTCPrice, swap]);

  if (swap.status === 'COMPLETED' || swap.status === 'EXPIRED') {
    return (
      <Container>
        <BigText data-testid={buildTestId('status-label')}>
          <CoinWithText>
            <CoinIcon symbol={swap.currencyDeposit} />
            &nbsp;
            {getCryptoAssetFormatter({ locale, displaySymbol: swap.currencyDeposit }).format(
              +swap.amountDeposit,
            )}
          </CoinWithText>
          <Icon.SwapVertical />
          <CoinWithText>
            <CoinIcon symbol={swap.currencyReceiving} />
            &nbsp;
            {getCryptoAssetFormatter({ locale, displaySymbol: swap.currencyReceiving }).format(
              receivedAmount,
            )}
          </CoinWithText>
        </BigText>
      </Container>
    );
  }

  if (
    swap.status === 'PENDING' ||
    swap.status === 'SIGNING' ||
    swap.status === 'SENDING' ||
    swap.status === 'SIGNING_REFUND' ||
    swap.status === 'SENDING_REFUND' ||
    swap.status === 'REFUNDED'
  ) {
    return (
      <>
        <BigText data-testid={buildTestId('status-label')}>
          <FormattedMessage
            id={`widget.status-label-long.${swap.status}`}
            values={{
              value: (
                <FancyCryptoAmount amount={receivedAmount} displaySymbol={swap.currencyReceiving} />
              ),
            }}
          />
        </BigText>
        <Space size={smallSpaceSize} />
        <CopyToClipboard
          value={swap.addressReceiving}
          left={<CoinIcon symbol={swap.currencyReceiving} />}
          size={copyToClipboardSize}
          data-testid={buildTestId('address')}
        />
      </>
    );
  }

  return (
    <>
      <BigText data-testid={buildTestId('status-label')}>
        <FormattedMessage
          id={`widget.status-label-long.${swap.status}`}
          values={{
            value: (
              <FancyCryptoAmount
                amount={+swap.amountDeposit}
                displaySymbol={swap.currencyDeposit}
              />
            ),
          }}
        />
      </BigText>
      {!!sendExactlyNote && <SmallText>{sendExactlyNote}</SmallText>}
      <Space size={smallSpaceSize} />
      <CopyToClipboard
        variant="accent"
        value={swap.addressDeposit}
        left={<CoinIcon symbol={swap.currencyDeposit} />}
        size={copyToClipboardSize}
        data-testid={buildTestId('address')}
      />
      {typeof swap.amountReceiving === 'string' && (
        <>
          <Space size={spaceSize} />
          {swap.isSkypoolsSwap ? (
            <SmallText>
              <FormattedMessage
                id="widget.will-allocate"
                values={{
                  value: (
                    <FancyCryptoAmount
                      amount={receivedAmount}
                      displaySymbol={swap.currencyReceiving}
                    />
                  ),
                  address: swap.addressReceiving,
                }}
              />
            </SmallText>
          ) : (
            <>
              <SmallText>
                <FormattedMessage
                  id="widget.will-send-back"
                  values={{
                    value: (
                      <FancyCryptoAmount
                        amount={receivedAmount}
                        displaySymbol={swap.currencyReceiving}
                      />
                    ),
                  }}
                />
              </SmallText>
              <Space size={spaceSize} />
              <SmallText>{swap.addressReceiving}</SmallText>
            </>
          )}

          <Space size={spaceSize} />
          <FeeText>
            <FormattedMessage
              id="widget.swap-network-fees"
              values={{
                value: <FormattedNumber value={Number(swap.feeTotal)} maximumFractionDigits={4} />,
                symbol: swap.feeCurrency,
              }}
            />
          </FeeText>

          {Number(swap.rebalanceRewards) > 0 && (
            <FeeText>
              <FormattedMessage
                id="widget.swap-rebalance-rewards"
                values={{
                  value: (
                    <FormattedNumber
                      value={Number(swap.rebalanceRewards)}
                      maximumFractionDigits={4}
                    />
                  ),
                  symbol: 'SWINGBY',
                }}
              />
            </FeeText>
          )}
          <Space size={spaceSize} />

          <SmallText>
            <FormattedMessage id="widget.confirm-address" />
          </SmallText>
        </>
      )}
    </>
  );
};
