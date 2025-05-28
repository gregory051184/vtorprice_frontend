import { IWithClass } from '@types';
import { ICompany } from '../../../model';

export interface ICompanyCard extends IWithClass {
  company: ICompany,
}
