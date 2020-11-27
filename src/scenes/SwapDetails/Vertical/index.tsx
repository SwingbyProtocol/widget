import { CoinIcon, CopyToClipboard, useBuildTestId } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';
import { useRouter } from 'next/router';

import { StepIndicator } from '../../../components/StepIndicator';
import { FancyCryptoAmount } from '../../../components/FancyCryptoAmount';
import { VerticalWidgetView } from '../../../components/VerticalWidgetView';
import { useSwapDetails } from '../../useSwapDetails';

import { SwapContainer, SendLabel } from './styled';

export const Vertical = () => {
  const { buildTestId } = useBuildTestId({ id: 'vertical.swap-details' });
  const { swap } = useSwapDetails();
  const { push } = useRouter();

  if (!swap) {
    return <>…</>;
  }

  return (
    <SwapContainer>
      <VerticalWidgetView
        onClickBack={() => push('/swap/new')}
        top={
          <>
            <SendLabel data-testid={buildTestId('top.send-label')}>
              <FormattedMessage
                id="widget.send-to-long"
                values={{
                  value: (
                    <FancyCryptoAmount amount={+swap.amountIn} displaySymbol={swap.currencyIn} />
                  ),
                }}
              />
            </SendLabel>
            <CopyToClipboard
              value={swap.addressIn}
              left={<CoinIcon symbol={swap.currencyIn} />}
              size="country"
              data-testid={buildTestId('top.address')}
            />
          </>
        }
        data-testid={buildTestId('')}
      >
        <StepIndicator
          status="waiting"
          currencyIn={swap.currencyIn}
          currencyOut={swap.currencyOut}
          data-testid={buildTestId('bottom.step-indicator')}
        />
      </VerticalWidgetView>
    </SwapContainer>
  );
};
