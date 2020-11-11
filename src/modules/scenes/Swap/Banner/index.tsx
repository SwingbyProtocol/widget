import { Icon, useMatchMedia } from '@swingby-protocol/pulsar';
import { useState } from 'react';
import { useIntl } from 'react-intl';

import { CoinAmount } from '../../../../components/CoinAmount';
import { StylingConstants } from '../../../styles';

import { StyledButton, BannerContainer } from './styled';

export const Banner = () => {
  const { formatMessage } = useIntl();
  const [coinAmountState, setCoinAmountState] = useState(CoinAmount.emptyState);
  const hasWideWidth = useMatchMedia({ query: StylingConstants.mediaWideWidth });

  return (
    <BannerContainer>
      <CoinAmount variant="banner" state={coinAmountState} onChange={setCoinAmountState} />

      <StyledButton variant="primary" size="state">
        {hasWideWidth ? formatMessage({ id: 'widget.swap-btn' }) : <Icon.CaretRight />}
      </StyledButton>
    </BannerContainer>
  );
};
