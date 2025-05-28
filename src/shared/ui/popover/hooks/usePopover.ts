import {
  offset, useFloating, flip, shift, size
} from '@floating-ui/react';
import { shiftToContainer } from '../middlewares';

export const usePopover = ({
  width,
  position,
  containerSize
}:{
  width: 'target' | number,
  position: 'top' | 'bottom',
  containerSize?: number
}) => {
  const floating = useFloating({
    placement: position,
    middleware: [
      offset(10), flip(), shift(),
      ...(width === 'target'
        ? [
          size({
            apply({ rects, elements }) {
              Object.assign(elements.floating?.style ?? {}, {
                width: `${rects.reference.width}px`,
              });
            },
          }),
        ]
        : []),
      shiftToContainer(containerSize),
    ],

  });

  return {
    floating
  };
};
