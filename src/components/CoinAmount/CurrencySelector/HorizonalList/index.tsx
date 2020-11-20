import { CoinIcon, Testable, useBuildTestId } from '@swingby-protocol/pulsar';
import { Coin } from '@swingby-protocol/sdk';
import { useTransition, animated } from 'react-spring';

import { getCoinList } from '../../../../modules/coins';
import { BackButton } from '../../../BackButton';

import { HorizontalSelectorBg, Container, CoinList, CoinButton, CoinListWrapper } from './styled';

type Props = {
  except?: Coin;
  isOpen: boolean;
  onClose: () => void;
  onChange: (coin: Coin) => void;
} & Testable;

export const HorizonalList = ({
  except,
  isOpen,
  onClose,
  onChange,
  'data-testid': testId,
}: Props) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  const boxTransitions = useTransition(isOpen, null, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
  });

  const contentTransitions = useTransition(isOpen, null, {
    from: { opacity: 0, transform: 'translateX(100vw)' },
    enter: { opacity: 1, transform: 'translateX(0)' },
    leave: { opacity: 0, transform: 'translateX(100vw)' },
  });

  return (
    <>
      {boxTransitions.map(
        ({ item, key, props }) =>
          item && (
            <HorizontalSelectorBg
              as={animated.div}
              onClick={onClose}
              style={props}
              key={key}
              data-testid={buildTestId('')}
            >
              {contentTransitions.map(
                ({ item, key, props }) =>
                  item && (
                    <Container as={animated.div} style={props} key={key}>
                      <BackButton data-testid={buildTestId('back-btn')} />
                      <CoinList>
                        <CoinListWrapper>
                          {getCoinList()
                            .filter((it) => it !== except)
                            .map((coin) => (
                              <CoinButton
                                variant="tertiary"
                                size="state"
                                onClick={() => {
                                  onChange(coin);
                                  onClose();
                                }}
                                data-testid={buildTestId(`item-${coin}`)}
                              >
                                <CoinIcon symbol={coin} />
                                &nbsp;{coin}
                              </CoinButton>
                            ))}
                        </CoinListWrapper>
                      </CoinList>
                    </Container>
                  ),
              )}
            </HorizontalSelectorBg>
          ),
      )}
    </>
  );
};
