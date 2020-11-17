import { CoinIcon, CopyToClipboard } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';
import { useSelector } from 'react-redux';

import { FancyCryptoAmount } from '../../../../../components/FancyCryptoAmount';
import { StepIndicator } from '../StepIndicator';
import { StepView } from '../StepView';

import { SendLabel } from './styled';

export const SendTo = ({ onClickBack }: { onClickBack: () => void }) => {
  const { currencyFrom } = useSelector((state) => state.form);
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
      <StepIndicator status="awaiting-deposit" />
    </StepView>
  );
};
