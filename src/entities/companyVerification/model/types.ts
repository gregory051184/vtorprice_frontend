import { TStatus } from '@types';
import { companyModel } from '@box/entities/company';

export interface ICompanyVerification {
  id: number,
  isDeleted: boolean,
  company: companyModel.ICompany
  createdAt: Date,
  status: TStatus
  comment: string,
  employee: companyModel.ICompanyMember
}
