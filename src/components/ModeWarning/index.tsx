import { FormattedMessage } from 'react-intl';

import { useSdkContext } from '../../modules/sdk-context';

import { ModeWarningContainer } from './styled';

export const ModeWarning = () => {
  const { mode } = useSdkContext();
  return (
    <ModeWarningContainer mode={mode}>
      <FormattedMessage id={`widget.warning-${mode}`} />
    </ModeWarningContainer>
  );
};
