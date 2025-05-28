import { ReactNode } from 'react';
import { IEquipmentApplication, IRecyclableApplication } from '../../../model';

export interface IUsersApplicationManagementRow {
  application: IRecyclableApplication,
  deleteButton?: ReactNode
}

export interface IUsersEquipmentApplicationManagementRow {
  application: IEquipmentApplication,
  deleteButton?: ReactNode
}
