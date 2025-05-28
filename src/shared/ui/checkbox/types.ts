import { IWithClass } from '@types';
import React, { ReactNode } from 'react';

type DefaultProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'checked'>;

export interface ICheckbox extends IWithClass, DefaultProps {
  checked: boolean
  onChange: (val: boolean)=>void
  description?: ReactNode
}
