import classNames from 'classnames';
import React from 'react';
import { IPillSelect } from '../types';

export function PillSelect<T>({
  className,
  value,
  values,
  onChange,
}:IPillSelect<T>) {
  return (
    <div className={classNames('flex gap-[10px] flex-wrap', className)}>
      {values.map((val) => {
        const selected = (value.some((el) => el.id === val.id));
        return (
          <button
            type="button"
            key={val.id}
            onClick={() => {
              if (selected) {
                onChange(value.filter((el) => el.id !== val.id));
                return;
              }
              onChange([...value, val]);
            }}
            className={classNames(
              'text-sm px-[12px] py-[4px] rounded-full cursor-pointer',
              { 'bg-primaryGreen-main text-white': selected },
              { 'bg-grey-20 text-black': !selected },
            )}
          >
            <span>{val.label}</span>
          </button>
        );
      })}
    </div>
  );
}
