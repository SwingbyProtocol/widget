import { TextInput } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { actionSetFormData } from '../../modules/store/form';

import { CoinAmountContainer, Label, SwapVertical, SwapHorizontal, Variant } from './styled';
import { CurrencySelector } from './CurrencySelector';

type Props = { variant: Variant };

export const CoinAmount = ({ variant }: Props) => {
  const { amountFrom, currencyFrom, amountTo, currencyTo } = useSelector((state) => state.form);
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
        onChange={(currencyFrom) => dispatch(actionSetFormData({ currencyFrom }))}
      />
      <TextInput
        size="state"
        value={amountFrom}
        onChange={(evt) => dispatch(actionSetFormData({ amountFrom: evt.target.value }))}
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
        onChange={(currencyTo) => dispatch(actionSetFormData({ currencyTo }))}
      />
      <TextInput
        size="state"
        value={amountTo}
        onChange={(evt) => dispatch(actionSetFormData({ amountTo: evt.target.value }))}
      />
    </CoinAmountContainer>
  );
};
