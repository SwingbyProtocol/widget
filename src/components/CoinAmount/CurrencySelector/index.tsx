import {
  CoinIcon,
  Dropdown,
  Testable,
  useBuildTestId,
  useMatchMedia,
} from '@swingby-protocol/pulsar';
import { SkybridgeCoin } from '@swingby-protocol/sdk';
import { rem } from 'polished';
import { useEffect, useState } from 'react';

import { useWidgetLayout } from '../../../modules/layout';
import { StylingConstants } from '../../../modules/styles';

import { HorizonalList } from './HorizonalList';
import { ButtonCoin, ButtonCoinCaret, ButtonCoinName, LonelyCoinButton, Variant } from './styled';

type Props = {
  coins: SkybridgeCoin[];
  variant: Variant;
  value: SkybridgeCoin;
  onChange: (coin: SkybridgeCoin) => void;
} & Testable;

export const CurrencySelector = ({
  coins,
  variant,
  value,
  onChange,
  'data-testid': testId,
}: Props) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  const hasWideWidth = useMatchMedia({ query: StylingConstants.mediaWideWidth });
  const hasSymbolWebsite = useMatchMedia({ query: `(min-width: ${rem(400)})` });
  const [isHorizontalSelectorOpen, setHorizontalSelectorOpen] = useState(false);
  const layout = useWidgetLayout();

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
            {(layout !== 'website' || hasSymbolWebsite) && <>&nbsp;{value}</>}
          </Dropdown.DefaultTarget>
        }
        data-testid={buildTestId('')}
      >
        {coins.map((coin) => (
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
          coins={coins}
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
      <LonelyCoinButton
        onClick={() => setHorizontalSelectorOpen(true)}
        data-testid={buildTestId('')}
      >
        <CoinIcon symbol={value} />
      </LonelyCoinButton>
      <HorizonalList
        isOpen={isHorizontalSelectorOpen}
        coins={coins}
        onClose={() => setHorizontalSelectorOpen(false)}
        onChange={onChange}
        data-testid={buildTestId('coin-list')}
      />
    </>
  );
};
