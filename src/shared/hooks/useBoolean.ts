import { useState } from 'react';

export const useBoolean = (initial: boolean) => {
  const [bool, setBool] = useState(initial);
  const toggle = () => setBool((state) => !state);
  return {
    value: bool,
    setValue: setBool,
    toggle,
  };
};
