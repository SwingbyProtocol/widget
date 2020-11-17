import { Testable, TextInput, useBuildTestId } from '@swingby-protocol/pulsar';
import { FormattedMessage } from 'react-intl';
import { useDispatch, useSelector } from 'react-redux';

import { actionSetFormData } from '../../modules/store/form';

import { CoinAmountContainer, Label, SwapVertical, SwapHorizontal, Variant } from './styled';
import { CurrencySelector } from './CurrencySelector';

type Props = { variant: Variant } & Testable;

export const CoinAmount = ({ variant, 'data-testid': testId }: Props) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  const { amountFrom, currencyFrom, amountTo, currencyTo } = useSelector((state) => state.form);
  const dispatch = useDispatch();
  return (
    <CoinAmountContainer variant={variant} data-testid={buildTestId('')}>
      {variant === 'vertical' && (
        <Label>
          <FormattedMessage id="widget.from" />
        </Label>
      )}
      <CurrencySelector
        variant={variant}
        value={currencyFrom}
        onChange={(currencyFrom) => dispatch(actionSetFormData({ currencyFrom }))}
        data-testid={buildTestId('currency-from-select')}
      />
      <TextInput
        size="state"
        value={amountFrom}
        onChange={(evt) => dispatch(actionSetFormData({ amountFrom: evt.target.value }))}
        data-testid={buildTestId('amount-from')}
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
        data-testid={buildTestId('currency-to-select')}
      />
      <TextInput
        size="state"
        value={amountTo}
        onChange={(evt) => dispatch(actionSetFormData({ amountTo: evt.target.value }))}
        data-testid={buildTestId('amount-to')}
      />
    </CoinAmountContainer>
  );
};
