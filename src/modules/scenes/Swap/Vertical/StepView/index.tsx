import { PulsarThemeProvider } from '@swingby-protocol/pulsar';

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

type Props = { onClickBack?: () => void; top?: React.ReactNode; children?: React.ReactNode };

export const StepView = ({ onClickBack, top, children }: Props) => {
  const layout = useWidgetLayout();
  return (
    <StepViewContainer>
      {layout !== 'widget-small' && (top || onClickBack) && (
        <>
          <PulsarThemeProvider theme="accent">
            <FancyTopContainer>
              <Space size="city" />
              {onClickBack && <StyledBackButton onClick={onClickBack} />}
              <TopContent>{top}</TopContent>
              <Space size="city" />
            </FancyTopContainer>
          </PulsarThemeProvider>
        </>
      )}
      {layout === 'widget-small' && (top || onClickBack) && (
        <LightTopContainer>
          <Space size="city" />
          {onClickBack && <StyledBackButton onClick={onClickBack} />}
          {top && <TopContent>{top}</TopContent>}
        </LightTopContainer>
      )}
      <Space size="city" />
      {children && <BottomContainer>{children}</BottomContainer>}
      <Space size="city" />
    </StepViewContainer>
  );
};
