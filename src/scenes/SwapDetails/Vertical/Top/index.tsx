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

import { FancyCryptoAmount } from '../../../../components/FancyCryptoAmount';
import { Space } from '../../../../components/Space';
import { useWidgetLayout } from '../../../../modules/layout';

import { BigText, SmallText, CoinWithText, Container } from './styled';

export const Top = ({
  swap,
  'data-testid': testId,
}: Testable & { swap: NonNullable<DefaultRootState['swaps'][string]> }) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  const { locale } = useIntl();
  const layout = useWidgetLayout();
  const spaceSize = layout === 'widget-full' || layout === 'website' ? 'house' : 'room';
  const smallSpaceSize = layout === 'widget-full' || layout === 'website' ? 'closet' : 'drawer';
  const copyToClipboardSize = layout === 'widget-full' || layout === 'website' ? 'city' : 'town';

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
              +(swap.amountReceiving ?? 0),
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
                <FancyCryptoAmount
                  amount={+(swap.amountReceiving ?? 0)}
                  displaySymbol={swap.currencyReceiving}
                />
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
              id="widget.will-send-back"
              values={{
                value: (
                  <FancyCryptoAmount
                    amount={+swap.amountReceiving}
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
        </>
      )}
    </>
  );
};
