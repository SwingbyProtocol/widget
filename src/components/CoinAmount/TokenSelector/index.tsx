import { Button, CoinIcon, Dropdown, useMatchMedia } from '@swingby-protocol/pulsar';
import { Coin, SUPPORTED_COINS } from '@swingby-protocol/sdk';

import { StylingConstants } from '../../../modules/styles';

import { ButtonCoinCaret, ButtonCoinName, Variant } from './styled';

type Props = { variant: Variant; value: Coin; onChange: (coin: Coin) => void };

export const TokenSelector = ({ variant, value, onChange }: Props) => {
  const hasWideWidth = useMatchMedia({ query: StylingConstants.mediaWideWidth });

  if (variant === 'vertical') {
    return (
      <Dropdown
        target={
          <Dropdown.DefaultTarget variant="input" size="state">
            <CoinIcon symbol={value} />
            &nbsp;{value}
          </Dropdown.DefaultTarget>
        }
      >
        {SUPPORTED_COINS.map((coin) => (
          <Dropdown.Item key={coin} onClick={() => onChange(coin)}>
            <CoinIcon symbol={coin} />
            &nbsp;{coin}
          </Dropdown.Item>
        ))}
      </Dropdown>
    );
  }

  if (hasWideWidth) {
    return (
      <Button variant="tertiary" size="state">
        <CoinIcon symbol={value} />
        <ButtonCoinName>{value}</ButtonCoinName>
        <ButtonCoinCaret />
      </Button>
    );
  }

  return <CoinIcon symbol={value} />;
};
