import {
  CoinIcon,
  CopyToClipboard,
  getCryptoAssetFormatter,
  Icon,
  Testable,
  Tooltip,
  useBuildTestId,
} from '@swingby-protocol/pulsar';
import { FormattedMessage, useIntl } from 'react-intl';
import { DefaultRootState } from 'react-redux';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useInterval } from 'react-use';

import { FancyCryptoAmount } from '../../../../components/FancyCryptoAmount';
import { Space } from '../../../../components/Space';
import { useWidgetLayout } from '../../../../modules/layout';
import { useSbBTCPrice } from '../../../../modules/web3';

import { BigText, SmallText, CoinWithText, Container } from './styled';

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
    else return +(+(swap.amountDeposit ?? 0) * sbBTCPrice).toFixed(7);
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
          <SmallText>
            <FormattedMessage
              id={swap.isSkypoolsSwap ? 'widget.will-allocate' : 'widget.will-send-back'}
              values={{
                value: (
                  <FancyCryptoAmount
                    amount={receivedAmount}
                    displaySymbol={swap.currencyReceiving}
                  />
                ),
                address: (
                  <Tooltip content={swap.addressReceiving} targetHtmlTag="span">
                    {`${swap.addressReceiving.substr(0, 6)}…${swap.addressReceiving.substr(
                      swap.addressReceiving.length - 4,
                    )}`}
                  </Tooltip>
                ),
              }}
            />
          </SmallText>
          <SmallText>
            <FormattedMessage id="widget.confirm-address" />
          </SmallText>
        </>
      )}
    </>
  );
};
