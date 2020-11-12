import { Icon, useMatchMedia } from '@swingby-protocol/pulsar';
import { useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { CoinAmount } from '../../../../components/CoinAmount';
import { StylingConstants } from '../../../styles';

import { StyledButton, BannerContainer } from './styled';

export const Banner = () => {
  const { formatMessage } = useIntl();
  const [coinAmountState, setCoinAmountState] = useState(CoinAmount.emptyState);
  const hasWideWidth = useMatchMedia({ query: StylingConstants.mediaWideWidth });

  const isValid = useMemo(() => CoinAmount.isValid(coinAmountState), [coinAmountState]);

  return (
    <BannerContainer>
      <CoinAmount variant="banner" state={coinAmountState} onChange={setCoinAmountState} />
      <StyledButton variant="primary" size="state" disabled={!isValid}>
        {hasWideWidth ? formatMessage({ id: 'widget.swap-btn' }) : <Icon.CaretRight />}
      </StyledButton>
    </BannerContainer>
  );
};
