import { createContext } from 'react';
import { useFloating } from '@floating-ui/react';

type ContextType = {
  position?: 'top' | 'bottom',
  opened: boolean,
  close: ()=>void,
  dropdownHeight: number | string
  dropdownWidth: 'target' | number
  center: boolean,
  floating: ReturnType<typeof useFloating>
};

const PopoverContext = createContext<ContextType | null>(null);

export {
  PopoverContext
};
