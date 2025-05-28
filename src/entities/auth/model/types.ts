import { IUser } from '@box/entities/user';
import { companyModel } from '@box/entities/company';

export interface IAuthUser extends IUser {
  company: companyModel.ICompany
  role: {
    id: number
  } 
}
