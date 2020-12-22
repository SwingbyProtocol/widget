import {
  CoinIcon,
  CopyToClipboard,
  getCryptoAssetFormatter,
  Icon,
  QRCodeButton,
  Testable,
  useBuildTestId,
} from '@swingby-protocol/pulsar';
import { FormattedMessage, useIntl } from 'react-intl';
import { DefaultRootState } from 'react-redux';

import { FancyCryptoAmount } from '../../../../components/FancyCryptoAmount';
import { Space } from '../../../../components/Space';
import { getTransferUriFor } from '../../../../modules/send-funds-uri';

import { BigText, CoinWithText, Container, AddressAndQr } from './styled';

export const Top = ({
  swap,
  'data-testid': testId,
}: Testable & { swap: NonNullable<DefaultRootState['swaps'][string]> }) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  const { locale } = useIntl();

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
        <Space size="town" />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <CopyToClipboard
            value={swap.addressReceiving}
            left={<CoinIcon symbol={swap.currencyReceiving} />}
            size="country"
            data-testid={buildTestId('address')}
          />
        </div>
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
      <Space size="town" />
      <AddressAndQr>
        <CopyToClipboard
          value={swap.addressDeposit}
          left={<CoinIcon symbol={swap.currencyDeposit} />}
          size="country"
          data-testid={buildTestId('address')}
        />
        <Space size="town" />
        <QRCodeButton
          variant="primary"
          size="town"
          shape="square"
          value={getTransferUriFor({
            address: swap.addressDeposit,
            coin: swap.currencyDeposit,
            amount: swap.amountDeposit,
          })}
        />
      </AddressAndQr>
    </>
  );
};
