import { ReactNode } from 'react';
import { IEquipmentApplication } from '../../../model';

export interface IUsersEquipmentApplicationRow {
  application: IEquipmentApplication,
  deleteButton?: ReactNode
}
