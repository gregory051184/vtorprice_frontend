import React from 'react';
import classNames from 'classnames';
import { IContainer } from './types';
import s from './style.module.scss';

export const Container: React.FC<IContainer> = ({
  className,
  children,
}) => (
  <div className={classNames(s.container, className)}>
    {children}
  </div>
);
