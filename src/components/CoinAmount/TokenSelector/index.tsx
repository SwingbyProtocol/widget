import { Button, CoinIcon, Dropdown, useMatchMedia } from '@swingby-protocol/pulsar';
import { Coin, SUPPORTED_COINS } from '@swingby-protocol/sdk';
import { useEffect, useState } from 'react';

import { StylingConstants } from '../../../modules/styles';

import { HorizontalSelector } from './HorizonalSelector';
import { ButtonCoinCaret, ButtonCoinName, LonelyCoinButton, Variant } from './styled';

type Props = { variant: Variant; value: Coin; onChange: (coin: Coin) => void };

export const TokenSelector = ({ variant, value, onChange }: Props) => {
  const hasWideWidth = useMatchMedia({ query: StylingConstants.mediaWideWidth });
  const [isHorizontalSelectorOpen, setHorizontalSelectorOpen] = useState(false);

  useEffect(() => {
    if (variant === 'vertical') {
      setHorizontalSelectorOpen(false);
    }
  }, [variant]);

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
      <>
        <Button variant="tertiary" size="state" onClick={() => setHorizontalSelectorOpen(true)}>
          <CoinIcon symbol={value} />
          <ButtonCoinName>{value}</ButtonCoinName>
          <ButtonCoinCaret />
        </Button>
        <HorizontalSelector
          isOpen={isHorizontalSelectorOpen}
          onClose={() => setHorizontalSelectorOpen(false)}
        />
      </>
    );
  }

  return (
    <>
      <LonelyCoinButton onClick={() => setHorizontalSelectorOpen(true)}>
        <CoinIcon symbol={value} />
      </LonelyCoinButton>
      <HorizontalSelector
        isOpen={isHorizontalSelectorOpen}
        onClose={() => setHorizontalSelectorOpen(false)}
      />
    </>
  );
};
