import { IContractor } from '@box/entities/contractors/model';
import { IWithClass } from '@types';

export interface IContractorCard extends IWithClass {
  contractor: IContractor,
}
