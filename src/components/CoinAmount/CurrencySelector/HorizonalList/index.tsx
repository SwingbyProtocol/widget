import { CoinIcon } from '@swingby-protocol/pulsar';
import { Coin, SUPPORTED_COINS } from '@swingby-protocol/sdk';
import { useTransition, animated } from 'react-spring';

import { BackButton } from '../../../BackButton';

import { HorizontalSelectorBg, Container, CoinList, CoinButton, CoinListWrapper } from './styled';

type Props = { isOpen: boolean; onClose: () => void; onChange: (coin: Coin) => void };

export const HorizonalList = ({ isOpen, onClose, onChange }: Props) => {
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
            <HorizontalSelectorBg as={animated.div} onClick={onClose} style={props} key={key}>
              {contentTransitions.map(
                ({ item, key, props }) =>
                  item && (
                    <Container as={animated.div} style={props} key={key}>
                      <BackButton />
                      <CoinList>
                        <CoinListWrapper>
                          {SUPPORTED_COINS.map((coin) => (
                            <CoinButton
                              variant="tertiary"
                              size="state"
                              onClick={() => {
                                onChange(coin);
                                onClose();
                              }}
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
