import classNames from 'classnames';
import React from 'react';
import { IPaper } from './types';

export const Paper: React.FC<IPaper> = ({
  children,
  className,
  mode = 'filled',
}) => (
  <div className={classNames(
    'rounded-[20px] px-[32px] py-[26px]',
    { 'bg-grey-10': mode === 'filled' },
    { 'bg-white border border-grey-20': mode === 'light' },
    className,
  )}
  >
    {children}
  </div>
);
