import { TextInput } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { actionSetFormAmounts } from '../../modules/store/formAmounts';

import { CoinAmountContainer, Label, SwapVertical, SwapHorizontal, Variant } from './styled';
import { CurrencySelector } from './CurrencySelector';

type Props = { variant: Variant };

export const CoinAmount = ({ variant }: Props) => {
  const { amountFrom, currencyFrom, amountTo, currencyTo } = useSelector(
    (state) => state.formAmounts,
  );
  const dispatch = useDispatch();
  return (
    <CoinAmountContainer variant={variant}>
      {variant === 'vertical' && (
        <Label>
          <FormattedMessage id="widget.from" />
        </Label>
      )}
      <CurrencySelector
        variant={variant}
        value={currencyFrom}
        onChange={(currencyFrom) => dispatch(actionSetFormAmounts({ currencyFrom }))}
      />
      <TextInput
        size="state"
        value={amountFrom}
        onChange={(evt) => dispatch(actionSetFormAmounts({ amountFrom: evt.target.value }))}
      />
      {variant === 'vertical' && <Label />}
      {variant === 'banner' ? <SwapHorizontal /> : <SwapVertical />}
      {variant === 'vertical' && (
        <Label>
          <FormattedMessage id="widget.to" />
        </Label>
      )}
      <CurrencySelector
        variant={variant}
        value={currencyTo}
        onChange={(currencyTo) => dispatch(actionSetFormAmounts({ currencyTo }))}
      />
      <TextInput
        size="state"
        value={amountTo}
        onChange={(evt) => dispatch(actionSetFormAmounts({ amountTo: evt.target.value }))}
      />
    </CoinAmountContainer>
  );
};
