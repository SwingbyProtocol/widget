import { FormattedMessage } from 'react-intl';

import { Space } from '../Space';

import { Container, Content, Countries, Warning } from './styled';

export const IpBlockWarning = () => {
  return (
    <Container>
      <Content>
        <Warning>
          <FormattedMessage id="widget.ip-block" />
        </Warning>
        <Space size="street" />
        <Countries>
          <FormattedMessage id="widget.blocked-countries" />
        </Countries>
      </Content>
    </Container>
  );
};
