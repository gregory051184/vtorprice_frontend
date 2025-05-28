import { ReactElement, ReactNode } from 'react';
import { IWithSx } from '@types';

type DefaultInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onClick' | 'onChange' | 'ref' | 'style'>;

export interface IAppInput extends DefaultInputProps, IWithSx {
  inputAfterFloat?: number | null | undefined

  width?: number | string
  loading?: boolean
  error?:boolean

  placeholderPlain?: boolean

  inputInactive?: boolean
  active?: boolean

  iconRight?: ReactNode | ReactElement,
  iconLeft?: ReactNode | ReactElement,

  mode?: 'normal' | 'stroke',

  onClick?: (ev: React.SyntheticEvent)=>void
  onChange?: (val: string)=>void

  inputRef?: React.MutableRefObject<HTMLInputElement>
  | React.MutableRefObject<null>
}

export interface IBaseInput extends Omit<IAppInput, 'icon'> {}

export interface ISearchInput extends Omit<IAppInput, 'icon'> {}

export interface ISearchDebounce {
  value: string
  onChange: (val: string) => void
  className?:string
}

export interface IPartialInput {
  numCells: number;
  onInput: (val: string) => void;
  className?: string;
  type: 'number' | 'text';
  error?: boolean;
}
