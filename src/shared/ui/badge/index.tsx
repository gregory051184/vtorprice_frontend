import React from 'react';
import classNames from 'classnames';
import { IBadge } from './types';

const colorSchemes = {
  red: {
    text: 'text-red-dark',
    conatiner: 'bg-red-light'
  },
  green: {
    text: 'text-green-dark',
    conatiner: 'bg-green-light'
  },
  blue: {
    text: 'text-blue-dark',
    conatiner: 'bg-blue-light'
  }
};
export const Badge: React.FC<IBadge> = ({
  children,
  className,
  color = 'green',
  onClick = () => null
}) => (
  <div onClick={onClick} className={classNames('inline-block px-[12px] py-[6px] rounded-[8px]', colorSchemes[color].conatiner, className)}>
    <span className={classNames('font-semibold text-sm', colorSchemes[color].text)}>
      {children}
    </span>
  </div>
);
