import { useState } from 'react';
import { useIntl } from 'react-intl';

import { CoinAmount } from '../../../../components/CoinAmount';

import { StyledButton, BannerContainer } from './styled';

export const Banner = () => {
  const { formatMessage } = useIntl();
  const [coinAmountState, setCoinAmountState] = useState(CoinAmount.emptyState);

  return (
    <BannerContainer>
      <CoinAmount variant="banner" state={coinAmountState} onChange={setCoinAmountState} />
      <StyledButton variant="primary" size="state">
        {formatMessage({ id: 'widget.swap-btn' })}
      </StyledButton>
    </BannerContainer>
  );
};
