import { Button, Icon } from '@swingby-protocol/pulsar';
import React from 'react';

export const BackButton = (
  props: Pick<React.ComponentPropsWithoutRef<typeof Button>, 'onClick' | 'className'>,
) => {
  return (
    <Button variant="secondary" size="street" shape="circle" {...props}>
      <Icon.CaretLeft />
    </Button>
  );
};
