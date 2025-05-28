import { ReactNode } from 'react';
import { IWithClass, IWithSx } from '@box/types';

type DefaultButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'type' | 'style' >;

export interface IButton extends IWithClass, DefaultButtonProps, IWithSx {
  type?: 'normal' | 'mini' | 'micro',
  mode?: 'light' | 'fill' | 'stroke' | 'notFilled',
  iconLeft?: ReactNode,
  iconRight?:ReactNode,
  children?: ReactNode,
  fullWidth?: boolean,
  rounded?: boolean,
  loading?: boolean,
  childrenClassName?: string,
  htmlType?: React.ButtonHTMLAttributes<HTMLButtonElement>['type'],
  width?: string | number,
  //ДОБАВИЛ
  make_circle?: boolean
  height?: string | number,
  boxShadow?: boolean,
}
