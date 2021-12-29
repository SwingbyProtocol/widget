import { PulsarThemeProvider, Testable, useBuildTestId } from '@swingby-protocol/pulsar';
import { useRouter } from 'next/router';

import { useDetails } from '../../modules/details';
import { useWidgetLayout } from '../../modules/layout';
import { BackButton } from '../BackButton';
import { Space } from '../Space';

import { ConnectWallet } from './ConnectWallet';
import {
  BottomContainer,
  Container,
  FancyTopContainer,
  LightTopContainer,
  NavBarContainer,
  StepViewContainer,
  TopContent,
} from './styled';

type Props = {
  onClickBack?: () => void;
  top?: React.ReactNode;
  children?: React.ReactNode;
} & Testable;

export const VerticalWidgetView = ({
  onClickBack,
  top,
  children,
  'data-testid': testId,
}: Props) => {
  const {
    query: { disableNavigation },
  } = useRouter();
  const { buildTestId } = useBuildTestId({ id: testId });
  const layout = useWidgetLayout();
  const { swap } = useDetails();
  return (
    <Container data-testid={buildTestId('')}>
      <StepViewContainer>
        {layout !== 'widget-small' && (top || onClickBack) && (
          <>
            <PulsarThemeProvider theme="accent">
              <FancyTopContainer data-testid={buildTestId('top')}>
                <Space size="widgetVerticalPadding" />
                <NavBarContainer>
                  {typeof disableNavigation === 'undefined' &&
                    onClickBack &&
                    !swap?.isSkypoolsSwap && (
                      <BackButton onClick={onClickBack} data-testid={buildTestId('back-btn')} />
                    )}
                  <Space size="box" shape="fill" />
                  {swap?.currencyDeposit !== 'BTC' && <ConnectWallet />}
                </NavBarContainer>
                <TopContent>{top}</TopContent>
                <Space size="city" />
              </FancyTopContainer>
            </PulsarThemeProvider>
          </>
        )}
        {layout === 'widget-small' && (top || onClickBack) && (
          <LightTopContainer data-testid={buildTestId('top')}>
            <Space size="widgetVerticalPadding" />
            <NavBarContainer>
              {onClickBack && (
                <BackButton onClick={onClickBack} data-testid={buildTestId('back-btn')} />
              )}
              <Space size="box" shape="fill" />
              <ConnectWallet />
            </NavBarContainer>
            {top && <TopContent>{top}</TopContent>}
          </LightTopContainer>
        )}
        <Space size="widgetVerticalPadding" />
        {children && (
          <BottomContainer data-testid={buildTestId('bottom')} hasNoTop={!top}>
            {children}
          </BottomContainer>
        )}
        <Space size="widgetVerticalPadding" />
      </StepViewContainer>
    </Container>
  );
};
