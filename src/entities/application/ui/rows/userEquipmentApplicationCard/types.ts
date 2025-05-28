import { IWithClass } from '@types';
import { IEquipmentApplication } from '../../../model';

export interface IUserEquipmentApplicationCard extends IWithClass {
  application: IEquipmentApplication,
  deleteIcon: React.ReactNode,
}
