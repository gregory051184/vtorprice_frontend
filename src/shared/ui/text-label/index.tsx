import React from 'react';
import classNames from 'classnames';
import { ITextLabel } from './types';

export const TextLabel: React.FC<ITextLabel> = ({ children, className }) => (
  <h2 className={classNames('text-lg', className)}>{children}</h2>
);
