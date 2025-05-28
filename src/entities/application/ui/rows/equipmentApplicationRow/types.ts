import { ReactNode } from 'react';
import { IEquipmentApplication } from '../../../model';

export interface IApplicationsFavoriteRow {
  application: IEquipmentApplication;
  buttons: ReactNode;
}
