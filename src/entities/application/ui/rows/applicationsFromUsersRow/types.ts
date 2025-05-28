import { IRecyclableApplication } from '../../../model';

export interface IApplicationsFromUsersRow {
  application: IRecyclableApplication,
  selected: boolean,
  onSelect: (val: boolean)=>void
}
