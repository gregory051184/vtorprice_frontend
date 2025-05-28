import { companyApi } from '@box/entities/company';

export const companySelectApi = async (search: string, manager?: number) => {
  const { data } = await companyApi.getCompanies({
    search,
    manager,
    global_search: true
  });
  
  return data.results.map((company) => ({
    id: company.id,
    label: company.name,
    value: company
  }));
};

export const existingCompanySelectApi = async (search: string, manager?: number) => {
  const { data } = await companyApi.getCompanies({
    search,
    manager,
    global_search: false
  });

  return data.results.map((company) => ({
    id: company.id,
    label: company.name,
    value: company
  }));
};
