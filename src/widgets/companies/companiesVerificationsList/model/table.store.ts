import { createGate } from 'effector-react';
import {
  sample, attach, merge
} from 'effector';
import { companyVerificationModel } from '@box/entities/companyVerification';
import {
  companiesVerificationsListFiltersModel,
} from '@box/features/company';
import { createPagination } from '@box/shared/lib/factories';

const gate = createGate();

const pagination = createPagination(
  companyVerificationModel.getCompaniesVerificationsFx,
  merge(
    [gate.close, companiesVerificationsListFiltersModel.filters.$values]
  )
);
const getCompaniesVerificationsFx = attach({
  source: {
    filters: companiesVerificationsListFiltersModel.filters.$values,
    page: pagination.$currentPage
  },
  mapParams: (_, { filters, page }) => ({
    // eslint-disable-next-line max-len
    company__recyclables__recyclables__category: filters.company__recyclables__recyclables__category?.value.id,
    company__city: filters.company__city?.value.id,
    search: filters.search,
    collection_type: filters.collection_type?.value.id,
    page
  }),
  effect: companyVerificationModel.getCompaniesVerificationsFx
});

sample({
  clock: [
    gate.open,
    companiesVerificationsListFiltersModel.filters.$values,
    pagination.loadMore
  ],
  source: companiesVerificationsListFiltersModel.filters.$values,
  target: getCompaniesVerificationsFx
});

export {
  getCompaniesVerificationsFx,
  gate,
  pagination
};
