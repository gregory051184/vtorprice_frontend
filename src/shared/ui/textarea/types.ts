import React from 'react';
import { IWithSx } from '@types';

type DefaultProps = React.DetailedHTMLProps<
React.TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement
>;
export interface ITextArea extends Omit<DefaultProps, 'style' | 'onChange'>, IWithSx {
  onChange?: (val: string)=>void
}
