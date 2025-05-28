import { ReactNode } from 'react';
import { IRecyclableApplication } from '../../../model';

export interface IApplicationsFavoriteRow {
  application: IRecyclableApplication;
  favoriteButton: ReactNode;
}
