import { Button, Icon, Testable } from '@swingby-protocol/pulsar';
import React from 'react';

export const BackButton = (
  props: Pick<React.ComponentPropsWithoutRef<typeof Button>, 'onClick' | 'className'> & Testable,
) => {
  return (
    <Button variant="secondary" size="street" shape="circle" {...props}>
      <Icon.CaretLeft />
    </Button>
  );
};
