import { FormattedMessage } from 'react-intl';

import { useSdkContext } from '../../modules/sdk-context';

import { ModeWarningContainer, Link } from './styled';

export const ModeWarning = () => {
  const { mode } = useSdkContext();
  return (
    <ModeWarningContainer mode={mode}>
      <span>
        <FormattedMessage id={`widget.warning-${mode}`} />
        {mode === 'production' && (
          <>
            {' '}
            <Link
              href="https://skybridge-docs.swingby.network/getting-start/how-to-swap-tokens/swap-lifecycle#why-was-my-transaction-refunded"
              target="_blank"
              rel="noreferrer"
            >
              <FormattedMessage id="widget.warning.learn-more" />
            </Link>
          </>
        )}
      </span>
    </ModeWarningContainer>
  );
};
