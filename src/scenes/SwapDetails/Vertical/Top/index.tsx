import {
  CoinIcon,
  CopyToClipboard,
  getCryptoAssetFormatter,
  Icon,
  Testable,
  useBuildTestId,
} from '@swingby-protocol/pulsar';
import { FormattedMessage, useIntl } from 'react-intl';
import { DefaultRootState } from 'react-redux';

import { FancyCryptoAmount } from '../../../../components/FancyCryptoAmount';
import { Space } from '../../../../components/Space';
import { useWidgetLayout } from '../../../../modules/layout';

import { BigText, CoinWithText, Container } from './styled';

export const Top = ({
  swap,
  'data-testid': testId,
}: Testable & { swap: NonNullable<DefaultRootState['swaps'][string]> }) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  const { locale } = useIntl();
  const layout = useWidgetLayout();
  const spaceSize = layout === 'widget-full' || layout === 'website' ? 'town' : 'house';
  const copyToClipboardSize = layout === 'widget-full' || layout === 'website' ? 'country' : 'town';

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
        <Space size={spaceSize} />
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
      <Space size={spaceSize} />
      <CopyToClipboard
        value={swap.addressDeposit}
        left={<CoinIcon symbol={swap.currencyDeposit} />}
        size={copyToClipboardSize}
        data-testid={buildTestId('address')}
      />
    </>
  );
};
