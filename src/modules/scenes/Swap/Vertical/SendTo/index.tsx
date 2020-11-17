import { CoinIcon, CopyToClipboard } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { FancyCryptoAmount } from '../../../../../components/FancyCryptoAmount';
import { ProgressIndicator } from '../../../../../components/ProgressIndicator';
import { StepView } from '../StepView';

import { SendLabel } from './styled';

export const SendTo = ({ onClickBack }: { onClickBack: () => void }) => {
  const { currencyFrom, currencyTo } = useSelector((state) => state.form);
  return (
    <StepView
      onClickBack={onClickBack}
      top={
        <>
          <SendLabel>
            <FormattedMessage
              id="widget.send-to-long"
              values={{ value: <FancyCryptoAmount amount={1} displaySymbol="BTC" /> }}
            />
          </SendLabel>
          <CopyToClipboard value="aaaaa" left={<CoinIcon symbol={currencyFrom} />} size="country" />
        </>
      }
    >
      <ProgressIndicator
        status="awaiting-deposit"
        currencyFrom={currencyFrom}
        currencyTo={currencyTo}
      />
      <ProgressIndicator
        status="processing-swap"
        currencyFrom={currencyFrom}
        currencyTo={currencyTo}
      />
      <ProgressIndicator
        status="sending-swap"
        currencyFrom={currencyFrom}
        currencyTo={currencyTo}
      />
      <ProgressIndicator status="completed" currencyFrom={currencyFrom} currencyTo={currencyTo} />
    </StepView>
  );
};
