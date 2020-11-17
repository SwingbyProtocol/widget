import {
  CoinIcon,
  Dropdown,
  Testable,
  useBuildTestId,
  useMatchMedia,
} from '@swingby-protocol/pulsar';
import { Coin, SUPPORTED_COINS } from '@swingby-protocol/sdk';
import { useEffect, useState } from 'react';

import { StylingConstants } from '../../../modules/styles';

import { HorizonalList } from './HorizonalList';
import { ButtonCoin, ButtonCoinCaret, ButtonCoinName, LonelyCoinButton, Variant } from './styled';

type Props = { variant: Variant; value: Coin; onChange: (coin: Coin) => void } & Testable;

export const CurrencySelector = ({ variant, value, onChange, 'data-testid': testId }: Props) => {
  const { buildTestId } = useBuildTestId({ id: testId });
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
        data-testid={buildTestId('')}
      >
        {SUPPORTED_COINS.map((coin) => (
          <Dropdown.Item
            key={coin}
            onClick={() => onChange(coin)}
            data-testid={buildTestId(`item-${coin}`)}
          >
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
        <ButtonCoin
          variant="tertiary"
          size="state"
          onClick={() => setHorizontalSelectorOpen(true)}
          data-testid={buildTestId('')}
        >
          <CoinIcon symbol={value} />
          <ButtonCoinName>{value}</ButtonCoinName>
          <ButtonCoinCaret />
        </ButtonCoin>
        <HorizonalList
          isOpen={isHorizontalSelectorOpen}
          onClose={() => setHorizontalSelectorOpen(false)}
          onChange={onChange}
          data-testid={buildTestId('coin-list')}
        />
      </>
    );
  }

  return (
    <>
      <LonelyCoinButton onClick={() => setHorizontalSelectorOpen(true)}>
        <CoinIcon symbol={value} />
      </LonelyCoinButton>
      <HorizonalList
        isOpen={isHorizontalSelectorOpen}
        onClose={() => setHorizontalSelectorOpen(false)}
        onChange={onChange}
      />
    </>
  );
};