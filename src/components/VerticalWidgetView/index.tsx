import { PulsarThemeProvider, Testable, useBuildTestId } from '@swingby-protocol/pulsar';

import { Space } from '../Space';
import { useWidgetLayout } from '../../modules/layout';

import {
  Container,
  StepViewContainer,
  StyledBackButton,
  FancyTopContainer,
  TopContent,
  BottomContainer,
  LightTopContainer,
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
  const { buildTestId } = useBuildTestId({ id: testId });
  const layout = useWidgetLayout();
  return (
    <Container data-testid={buildTestId('')}>
      <StepViewContainer>
        {layout !== 'widget-small' && (top || onClickBack) && (
          <>
            <PulsarThemeProvider theme="accent">
              <FancyTopContainer data-testid={buildTestId('top')}>
                <Space size="widgetVerticalPadding" />
                {onClickBack && (
                  <StyledBackButton onClick={onClickBack} data-testid={buildTestId('back-btn')} />
                )}
                <TopContent>{top}</TopContent>
                <Space size="city" />
              </FancyTopContainer>
            </PulsarThemeProvider>
          </>
        )}
        {layout === 'widget-small' && (top || onClickBack) && (
          <LightTopContainer data-testid={buildTestId('top')}>
            <Space size="widgetVerticalPadding" />
            {onClickBack && (
              <StyledBackButton onClick={onClickBack} data-testid={buildTestId('back-btn')} />
            )}
            {top && <TopContent>{top}</TopContent>}
          </LightTopContainer>
        )}
        <Space size="widgetVerticalPadding" />
        {children && (
          <BottomContainer data-testid={buildTestId('bottom')}>{children}</BottomContainer>
        )}
        <Space size="widgetVerticalPadding" />
      </StepViewContainer>
    </Container>
  );
};
