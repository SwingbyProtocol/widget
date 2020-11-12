import { Icon, useMatchMedia } from '@swingby-protocol/pulsar';
import { useIntl } from 'react-intl';

import { CoinAmount } from '../../../../components/CoinAmount';
import { useAreFormAmountsValid } from '../../../store/formAmounts';
import { StylingConstants } from '../../../styles';

import { StyledButton, BannerContainer } from './styled';

export const Banner = () => {
  const { formatMessage } = useIntl();
  const hasWideWidth = useMatchMedia({ query: StylingConstants.mediaWideWidth });
  const { isFormDataValid } = useAreFormAmountsValid();

  return (
    <BannerContainer>
      <CoinAmount variant="banner" />
      <StyledButton variant="primary" size="state" disabled={!isFormDataValid}>
        {hasWideWidth ? formatMessage({ id: 'widget.swap-btn' }) : <Icon.CaretRight />}
      </StyledButton>
    </BannerContainer>
  );
};
