import React, { useContext } from 'react';
import { PopoverContext } from '@box/shared/ui/popover/PopoverContext';
import { IPopoverTarget } from '@box/shared/ui/popover/types';

const PopoverTarget: React.FC<IPopoverTarget> = ({
  children
}) => {
  const context = useContext(PopoverContext);
  if (context == null) {
    return null;
  }
  const { floating } = context;
  return (
    React.cloneElement(children, {
      ref: floating.refs.setReference,
    })
  );
};

export {
  PopoverTarget
};
