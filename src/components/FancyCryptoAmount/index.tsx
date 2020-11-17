import { getCryptoAssetFormatter } from '@swingby-protocol/pulsar';
import { useIntl } from 'react-intl';

import { Accent, Normal } from './styled';

type Props = { amount: number; displaySymbol: string };

export const FancyCryptoAmount = ({ amount, displaySymbol }: Props) => {
  const { locale } = useIntl();

  return (
    <span>
      {getCryptoAssetFormatter({ displaySymbol, locale })
        .formatToParts(amount)
        .map((it, index) => {
          if (
            it.type === 'decimal' ||
            it.type === 'fraction' ||
            it.type === 'group' ||
            it.type === 'infinity' ||
            it.type === 'integer' ||
            it.type === 'minusSign' ||
            it.type === 'nan' ||
            it.type === 'plusSign'
          ) {
            return <Accent key={index}>{it.value}</Accent>;
          }

          return <Normal key={index}>{it.value}</Normal>;
        })}
    </span>
  );
};
