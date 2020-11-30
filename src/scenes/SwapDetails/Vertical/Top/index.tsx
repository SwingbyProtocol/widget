import {
  Button,
  CoinIcon,
  CopyToClipboard,
  getCryptoAssetFormatter,
  Icon,
  Testable,
  useBuildTestId,
} from '@swingby-protocol/pulsar';
import { buildExplorerLink } from '@swingby-protocol/sdk';
import { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { DefaultRootState } from 'react-redux';

import { FancyCryptoAmount } from '../../../../components/FancyCryptoAmount';
import { Space } from '../../../../components/Space';
import { useSdkContext } from '../../../../modules/sdk-context';

import { BigText, CoinWithText, Container } from './styled';

export const Top = ({
  swap,
  'data-testid': testId,
}: Testable & { swap: NonNullable<DefaultRootState['swaps'][string]> }) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  const { locale } = useIntl();
  const context = useSdkContext();

  const explorerLink = useMemo(() => {
    if (!swap.transactionOutId) return undefined;
    return buildExplorerLink({
      context,
      currency: swap.currencyOut,
      transactionId: swap.transactionOutId,
    });
  }, [context, swap.currencyOut, swap.transactionOutId]);

  swap.status = 'completed' as any;

  if (swap.status === 'completed') {
    return (
      <Container>
        <BigText data-testid={buildTestId('sending-label')}>
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
        {explorerLink && (
          <>
            <Space size="town" />
            <Button
              variant="primary"
              size="country"
              shape="fit"
              href={explorerLink}
              target="_blank"
            >
              <FormattedMessage id="widget.explorer-link" />
            </Button>
          </>
        )}
      </Container>
    );
  }

  if (swap.status === 'signing' || swap.status === 'sending') {
    return (
      <>
        <BigText data-testid={buildTestId('sending-label')}>
          <FormattedMessage
            id="widget.sending-to-long"
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
        <CopyToClipboard
          value={swap.addressUserIn}
          left={<CoinIcon symbol={swap.currencyOut} />}
          size="country"
          data-testid={buildTestId('address')}
        />
        {explorerLink && (
          <>
            <Space size="town" />
            <Button variant="primary" size="country" shape="fit" href={explorerLink}>
              <FormattedMessage id="widget.explorer-link" />
            </Button>
          </>
        )}
      </>
    );
  }

  return (
    <>
      <BigText data-testid={buildTestId('send-label')}>
        <FormattedMessage
          id="widget.send-to-long"
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
