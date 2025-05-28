import { useState } from 'react';
import { useDebounce, useEffectAfterMount } from '@box/shared/hooks';
import { ISearchDebounce } from '../types';
import { SearchInput } from '../search_input';

export const SearchDebounce: React.FC<ISearchDebounce> = ({
  // eslint-disable-next-line react/prop-types.ts
  className = '', onChange = () => null, value = ''
}) => {
  const [val, setVal] = useState(value);
  const debouncedVal = useDebounce(val, 500);
  
  useEffectAfterMount(() => {
    onChange(debouncedVal);
  }, [debouncedVal]);
  
  return <SearchInput value={val} onChange={setVal} className={className} mode="stroke" />;
};
