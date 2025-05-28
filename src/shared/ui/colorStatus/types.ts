import { IWithClass } from '@types';
import { IStatus } from '@box/entities/logistics/model';

export interface IColorStatus extends IWithClass {
  status: IStatus & {logist?: boolean},
}
