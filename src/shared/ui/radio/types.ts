import { IWithClass } from '@types';
import React from 'react';

type DefaultProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'checked' | 'type'>;

export interface IRadio extends IWithClass, DefaultProps {
  checked: boolean
  onChange: (val: boolean)=>void
}
