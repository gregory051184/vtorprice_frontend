import React, { useContext } from 'react';
import { IPopoverDropdown } from '@box/shared/ui/popover/types';
import { PopoverContext } from '@box/shared/ui/popover/PopoverContext';
import { CSSTransition } from 'react-transition-group';
import { Portal } from '@box/hoc';

const PopoverDropdown: React.FC<IPopoverDropdown> = ({
  children,
}) => {
  const context = useContext(PopoverContext);
  if (context == null) {
    return null;
  }

  const {
    opened,
    dropdownHeight,
    dropdownWidth,
    floating,
    center
  } = context;

  return (
    <Portal containerId="modals">
      <CSSTransition nodeRef={floating.refs.floating} unmountOnExit timeout={200} classNames="fade" in={opened}>
        <div
          style={{
            width: dropdownWidth === 'target' ? undefined : dropdownWidth,
            position: floating.strategy,
            top: floating.y ?? 0,
            left: center ? floating.x ?? 0 : 0,
            height: dropdownHeight,
            zIndex: 1000
          }}
          ref={floating.refs.setFloating}
        >
          {children}
        </div>
      </CSSTransition>
    </Portal>
  );
};

export {
  PopoverDropdown
};
