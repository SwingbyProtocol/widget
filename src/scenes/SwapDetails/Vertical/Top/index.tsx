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

import { BigText, CoinWithText, Container } from './styled';

export const Top = ({
  swap,
  'data-testid': testId,
}: Testable & { swap: NonNullable<DefaultRootState['swaps'][string]> }) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  const { locale } = useIntl();

  if (swap.status === 'COMPLETED' || swap.status === 'REFUNDED' || swap.status === 'EXPIRED') {
    return (
      <Container>
        <BigText data-testid={buildTestId('status-label')}>
          <CoinWithText>
            <CoinIcon symbol={swap.currencyIn} />
            &nbsp;
            {getCryptoAssetFormatter({ locale, displaySymbol: swap.currencyIn }).format(
              +swap.amountIn,
            )}
          </CoinWithText>
          <Icon.SwapVertical />
          <CoinWithText>
            <CoinIcon symbol={swap.currencyOut} />
            &nbsp;
            {getCryptoAssetFormatter({ locale, displaySymbol: swap.currencyOut }).format(
              +(swap.amountOut ?? 0),
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
    swap.status === 'SENDING_REFUND'
  ) {
    return (
      <>
        <BigText data-testid={buildTestId('status-label')}>
          <FormattedMessage
            id={`widget.status-label-long.${swap.status}`}
            values={{
              value: (
                <FancyCryptoAmount
                  amount={+(swap.amountOut ?? 0)}
                  displaySymbol={swap.currencyOut}
                />
              ),
            }}
          />
        </BigText>
        <Space size="town" />
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <CopyToClipboard
            value={swap.addressUserIn}
            left={<CoinIcon symbol={swap.currencyOut} />}
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
            value: <FancyCryptoAmount amount={+swap.amountIn} displaySymbol={swap.currencyIn} />,
          }}
        />
      </BigText>
      <Space size="town" />
      <CopyToClipboard
        value={swap.addressSwapIn}
        left={<CoinIcon symbol={swap.currencyIn} />}
        size="country"
        data-testid={buildTestId('address')}
      />
    </>
  );
};
