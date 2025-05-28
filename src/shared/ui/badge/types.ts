import { IWithClass } from '@types';

export interface IBadge extends IWithClass {
  children: string,
  color?: 'red' | 'blue' | 'green',
  onClick?: ()=>void
}
