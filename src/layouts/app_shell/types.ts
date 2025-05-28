import { ReactElement } from 'react';
import { IWithChildren, IWithClass } from '@types';

export interface IAppShell extends IWithChildren, IWithClass {
  header?: ReactElement,
  footer?: ReactElement,
}
