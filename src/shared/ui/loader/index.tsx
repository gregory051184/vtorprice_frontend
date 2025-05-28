import React from 'react';
import classNames from 'classnames';
import { ILoader } from './types';
import s from './style.module.scss';

export const Loader: React.FC<ILoader> = ({
  center = false,
  className,
}) => (
  <div className={classNames({ 'flex justify-center items-center h-[60px]': center }, className)}>
    <span className={s.loader} />
  </div>
);
