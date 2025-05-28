import { IWithClass } from '@types';
import { applicationModel } from '@box/entities/application';
import { Pagination } from '@box/shared/lib/factories';

export interface IStockGlassApplicationsListTemplate extends IWithClass {
  applications: Array<applicationModel.IRecyclableApplication>

  pagination: Pagination
  title: string
}
