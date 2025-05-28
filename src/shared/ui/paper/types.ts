import { IWithClass, IWithChildren } from '@types';

export interface IPaper extends IWithChildren, IWithClass {
  mode?: 'filled' | 'light'
}
