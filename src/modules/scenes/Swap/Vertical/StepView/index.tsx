import { PulsarThemeProvider, Testable, useBuildTestId } from '@swingby-protocol/pulsar';

import { Space } from '../../../../../components/Space';
import { useWidgetLayout } from '../../../../layout';

import {
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

export const StepView = ({ onClickBack, top, children, 'data-testid': testId }: Props) => {
  const { buildTestId } = useBuildTestId({ id: testId });
  const layout = useWidgetLayout();
  return (
    <StepViewContainer data-testid={buildTestId('')}>
      {layout !== 'widget-small' && (top || onClickBack) && (
        <>
          <PulsarThemeProvider theme="accent">
            <FancyTopContainer data-testid={buildTestId('top')}>
              <Space size="widgetVerticalPadding" />
              {onClickBack && (
                <StyledBackButton onClick={onClickBack} data-testid={buildTestId('top.back-btn')} />
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
            <StyledBackButton onClick={onClickBack} data-testid={buildTestId('top.back-btn')} />
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
  );
};
