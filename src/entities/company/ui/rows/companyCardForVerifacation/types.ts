import { IWithClass } from '@types';
import { ICompany } from '../../../model';
import { companyVerificationModel } from '@box/entities/companyVerification';

export interface ICompanyCard extends IWithClass {
  company: ICompany,
  companyVerification: companyVerificationModel.ICompanyVerification,
}
