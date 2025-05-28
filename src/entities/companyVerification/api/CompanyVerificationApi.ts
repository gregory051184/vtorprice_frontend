import { AxiosResponse } from 'axios/index';
import { $authHost, $host } from '@box/shared/api';
import { Paginationable } from '@types';
import { ICompanyVerification } from '../model/types';

type SetCompanyVerificationParams = {
  id: number,
  status: number,
  comment?: string
};

type GetCompaniesVerificationsStatusParams = {
  company__recyclables__recyclables__category: number,
  company__city: number,
  search: string,
  collection_type: string,

  page: number
};
class CompanyVerificationApi {
  getCompanyVerification(id: number): Promise<AxiosResponse<ICompanyVerification>> {
    return $host.get(`/company_verification/${id}/`);
  }

  setCompanyVerification({ id, ...data }: SetCompanyVerificationParams):
  Promise<AxiosResponse<ICompanyVerification>> {
    return $authHost.put(`/company_verification/${id}/`, data);
  }

  getCompaniesVerifications(params: Partial<GetCompaniesVerificationsStatusParams>):
  Promise<AxiosResponse<{
    results: Array<ICompanyVerification>
  } & Paginationable>> {
    return $authHost.get('/company_verification/', {
      params
    });
  }
}

export const companyVerificationApi = new CompanyVerificationApi();
