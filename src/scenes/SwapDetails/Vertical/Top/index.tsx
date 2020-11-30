import { CoinIcon, CopyToClipboard, Testable, useBuildTestId } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';
import { DefaultRootState } from 'react-redux';

import { FancyCryptoAmount } from '../../../../components/FancyCryptoAmount';

import { SendLabel } from './styled';

export const Top = ({
  swap,
  'data-testid': testId,
}: Testable & { swap: NonNullable<DefaultRootState['swaps'][string]> }) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  return (
    <>
      <SendLabel data-testid={buildTestId('send-label')}>
        <FormattedMessage
          id="widget.send-to-long"
          values={{
            value: <FancyCryptoAmount amount={+swap.amountIn} displaySymbol={swap.currencyIn} />,
          }}
        />
      </SendLabel>
      <CopyToClipboard
        value={swap.addressSwapIn}
        left={<CoinIcon symbol={swap.currencyIn} />}
        size="country"
        data-testid={buildTestId('address')}
      />
    </>
  );
};
