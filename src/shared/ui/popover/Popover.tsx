import React from 'react';
import { IPopover } from '@box/shared/ui/popover/types';
import { PopoverTarget } from '@box/shared/ui/popover/PopoverTarget';
import { PopoverDropdown } from '@box/shared/ui/popover/PopoverDropdown';
import { usePopover } from '@box/shared/ui/popover/hooks/usePopover';
import { useClickOutside } from '@box/shared/hooks';
import { PopoverContext } from './PopoverContext';

const Popover = ({
  width = 'target',
  position = 'bottom',
  height = 'auto',
  opened,
  close,
  center = false,
  children,
  containerSize
}: IPopover) => {
  const { floating } = usePopover({
    width,
    position,
    containerSize
  });
  
  useClickOutside(() => {
    close();
    // @ts-ignore
  }, [floating.elements.floating, floating.elements.reference]);

  return (
    // eslint-disable-next-line react/jsx-no-constructed-context-values
    <PopoverContext.Provider value={{
      position,
      opened,
      close,
      center,
      floating,
      dropdownWidth: width,
      dropdownHeight: height
    }}
    >
      {children}
    </PopoverContext.Provider>
  );
};

Popover.Target = PopoverTarget;
Popover.Dropdown = PopoverDropdown;

export {
  Popover
};
