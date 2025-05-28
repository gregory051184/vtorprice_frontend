import React from 'react';
import { IWithChildren, IWithClass } from '@types';

export interface IFileButton extends IWithChildren, IWithClass {
  onChange: (file: FileList | null)=>void,
  mimes?: React.InputHTMLAttributes<HTMLInputElement>['accept'],
  multiple?: boolean
}
