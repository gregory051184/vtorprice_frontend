import { IWithChildren, IWithClass } from '@types';

export interface IModal extends IWithChildren, IWithClass {
  title?: string
  visible: boolean
  close: ()=>void
}
