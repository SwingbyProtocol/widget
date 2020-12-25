import { FormattedMessage } from 'react-intl';

import { useWidgetLayout } from '../../modules/layout';
import { Space } from '../Space';

import { Container, Content, Countries, Warning } from './styled';

export const IpBlockWarning = () => {
  const layout = useWidgetLayout();
  return (
    <Container>
      <Content>
        <Warning>
          <FormattedMessage id="widget.ip-block" />
        </Warning>
        {layout !== 'widget-banner' && (
          <>
            <Space size="street" />
            <Countries>
              <FormattedMessage id="widget.blocked-countries" />
            </Countries>
          </>
        )}
      </Content>
    </Container>
  );
};
