import React, { useMemo, useState } from 'react';
import { AppSelect } from '@box/shared/ui';
import { useEffectAfterMount } from '@box/shared/hooks';
import { ISelect } from './types';

export function Select<T>({ value, data, ...props }: ISelect<T>) {
  const [filterString, setFilterString] = useState(value?.label || '');
  const filteredValues = useMemo(() => {
    if (filterString.trim().length > 0) {
      try {
        return data.filter((option) => {
          const match = option.label.match(filterString.toString());
          return !!match;
        });
      } catch { /* empty */ }
    }
    return data;
  }, [filterString, data]);

  useEffectAfterMount(() => {
    setFilterString(value?.label || '');
  }, [value]);
  return (
    <AppSelect
      data={props.withSearch ? filteredValues : data}
      value={value}
      onInput={(val) => {
        setFilterString(val);
      }}
      inputValue={filterString}
      {...props}
    />
  );
}
