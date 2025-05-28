import { Store, Event } from 'effector';
import { applicationModel } from '@box/entities/application';
import { Pagination } from '@box/shared/lib/factories';
import { IWithClass } from '@types';

export interface IApplicationsFromUsersListTemplate extends IWithClass {
  applications: Store<Array<applicationModel.IRecyclableApplication>>,
  pagination: Pagination,
  selected: Store<number | null>,
  setSelected: Event<number>,
  title: string
}
