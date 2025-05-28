import { IWithClass } from '@types';
import { IEquipmentApplication } from '../../../model';

export interface IApplicationCard extends IWithClass {
  application: IEquipmentApplication,
  buttons: React.ReactNode
}
