import { ReactNode } from 'react';
import { IRecyclableApplication } from '../../../model';

export interface IUsersApplicationRow {
  application: IRecyclableApplication,
  deleteButton?: ReactNode
}
