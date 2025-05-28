import { IWithChildren, IWithClass } from '@types';

export interface ICollapse extends IWithClass, IWithChildren {
  opened: boolean,
  animate?: boolean
}
