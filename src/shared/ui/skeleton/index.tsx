import classNames from 'classnames';
import React from 'react';
import s from './style.module.scss';
import { ISkeleton } from './types';

export const Skeleton: React.FC<ISkeleton> = ({
  className,
  style = {},
}) => (
  <div style={style} className={classNames('flex overflow-hidden', className)}>
    <div className={s.skeleton_box} />

  </div>
);
