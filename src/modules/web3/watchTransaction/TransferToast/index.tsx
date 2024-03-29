import { PulsarThemeProvider } from '@swingby-protocol/pulsar';
import { buildExplorerLink, SkybridgeCoin } from '@swingby-protocol/sdk';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { useSdkContext } from '../../../store/sdkContext';

import { SuccessToastContainer, StyledToastButton } from './styled';

type Props = {
  transactionId?: string | null;
  confirmations?: number | null;
  transactionStatus?: boolean | null;
  error?: Error | null;
  coin: SkybridgeCoin;
};

export const TransferToast = ({
  transactionId,
  confirmations,
  transactionStatus,
  error,
  coin,
}: Props) => {
  const context = useSdkContext();

  const text = useMemo(() => {
    if (error) {
      return <FormattedMessage id="widget.onboard.transaction-result-bad" />;
    }

    if (confirmations) {
      return (
        <FormattedMessage
          id="widget.onboard.transaction-confirmed-by"
          values={{ value: confirmations }}
        />
      );
    }

    if (typeof transactionStatus === 'boolean') {
      return transactionStatus ? (
        <FormattedMessage id="widget.onboard.transaction-result-ok" />
      ) : (
        <FormattedMessage id="widget.onboard.transaction-result-bad" />
      );
    }

    return <FormattedMessage id="widget.onboard.transaction-sent" />;
  }, [confirmations, transactionStatus, error]);

  return (
    <PulsarThemeProvider>
      <SuccessToastContainer>
        {text}
        {transactionId && (
          <StyledToastButton
            variant="secondary"
            size="street"
            shape="fit"
            href={buildExplorerLink({ context, coin, transactionId })}
            target="_blank"
          >
            <FormattedMessage id="widget.onboard.explorer" />
          </StyledToastButton>
        )}
      </SuccessToastContainer>
    </PulsarThemeProvider>
  );
};
