import { contractorApi } from '../ContractorApi';

export const contractorsSelectApi = async () => {
  const { data } = await contractorApi.getContractors({});
  return data.results.map((contractor) => ({
    id: contractor.id,
    label: contractor.name,
    value: contractor.id
  }));
};
