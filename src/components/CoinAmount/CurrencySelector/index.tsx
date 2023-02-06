import {
  CoinIcon,
  Dropdown,
  Testable,
  useBuildTestId,
  useMatchMedia,
} from '@swingby-protocol/pulsar';
import { SkybridgeCoin } from '@swingby-protocol/sdk';
import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { StylingConstants } from '../../../modules/styles';
import { buildCoinMap, swingbyTextDisplay } from '../../../modules/coin-map';

import { HorizonalList } from './HorizonalList';
import {
  ButtonCoin,
  ButtonCoinCaret,
  ButtonCoinName,
  LonelyCoinButton,
  SectionTitle,
  Variant,
  CoinWithIcon,
} from './styled';

type Props = {
  coins: SkybridgeCoin[];
  variant: Variant;
  value: SkybridgeCoin;
  onChange: (coin: SkybridgeCoin) => void;
} & Testable;

export const CurrencySelector = ({
  coins: coinsParam,
  variant,
  value,
  onChange,
  'data-testid': testId,
}: Props) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  const hasWideWidth = useMatchMedia({ query: StylingConstants.mediaWideWidth });
  const [isHorizontalSelectorOpen, setHorizontalSelectorOpen] = useState(false);
  const { formatMessage } = useIntl();

  useEffect(() => {
    if (variant === 'vertical') {
      setHorizontalSelectorOpen(false);
    }
  }, [variant]);

  const coinMap = useMemo(() => buildCoinMap(coinsParam), [coinsParam]);

  if (variant === 'vertical') {
    return (
      <Dropdown
        target={
          <Dropdown.DefaultTarget variant="input" size="state">
            <CoinWithIcon>
              <CoinIcon symbol={value} />
              <>&nbsp;{swingbyTextDisplay(value)}</>
            </CoinWithIcon>
          </Dropdown.DefaultTarget>
        }
        data-testid={buildTestId('')}
      >
        {Array.from(coinMap.keys()).map((chain) => {
          const section = formatMessage({ id: `widget.coin-chain.${chain}` }).trim();
          const coins = coinMap.get(chain);
          if (!coins || coins.length < 1) {
            return null;
          }

          return (
            <React.Fragment key={chain}>
              {!!section && (
                <SectionTitle>
                  <FormattedMessage id={`widget.coin-chain.${chain}`} />
                </SectionTitle>
              )}
              {coins.map((coin) => (
                <Dropdown.Item
                  key={coin}
                  onClick={() => onChange(coin)}
                  data-testid={buildTestId(`item-${coin}`)}
                >
                  <CoinWithIcon>
                    <CoinIcon symbol={coin} />
                    &nbsp;{swingbyTextDisplay(coin).replace(/\..+$/, '')}
                  </CoinWithIcon>
                </Dropdown.Item>
              ))}
            </React.Fragment>
          );
        })}
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
          <ButtonCoinName>{swingbyTextDisplay(value)}</ButtonCoinName>
          <ButtonCoinCaret />
        </ButtonCoin>
        <HorizonalList
          coins={coinsParam}
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
        coins={coinsParam}
        onClose={() => setHorizontalSelectorOpen(false)}
        onChange={onChange}
        data-testid={buildTestId('coin-list')}
      />
    </>
  );
};
