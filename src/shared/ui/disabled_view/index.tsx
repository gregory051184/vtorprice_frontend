import { IWithChildren, IWithClass } from '@types';
import classNames from 'classnames';
import React from 'react';

export const DisabledView: React.FC<IWithChildren & IWithClass & { disabled: boolean, classNameForCloserEl?: string }> = ({
  children,
  disabled,
  className,
  classNameForCloserEl = null
}) => (
  <div className={classNames('relative', className)}>
    {disabled && <div className={`absolute z-20 opacity-60 bg-grey-10 w-full h-full ${classNameForCloserEl}`} />}
    {children}
  </div>
);
