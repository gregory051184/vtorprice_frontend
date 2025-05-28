import { companyApi, companyModel } from '@box/entities/company';
import { createOrdering, createPagination } from '@box/shared/lib/factories';
import { AxiosError } from 'axios';
import { createGate } from 'effector-react';
import {
  attach,
  createEffect,
  createEvent,
  createStore,
  forward,
  merge,
  sample,
} from 'effector';
import { createLoaderStore } from '@box/shared/lib/helpers';
import { myCompaniesFilter } from '@box/features/company/filters/myCompanies';
import { $authStore } from '@box/entities/auth';
import { ROLE } from '@box/types';

const gate = createGate();
const ordering = createOrdering();

const getCompaniesFx = createEffect<
Parameters<typeof companyApi.getCompanies>[0],
{
  data: Awaited<ReturnType<typeof companyApi.getCompanies>>['data'];
  page?: number;
},
AxiosError
>({
  handler: async (params) => {
    const { data } = await companyApi.getCompanies(params);

    return {
      data,
      page: params.page,
    };
  },
});

const myCompaniesLoading = createLoaderStore(false, getCompaniesFx);

const pagination = createPagination(getCompaniesFx, merge([
  gate.close,
  myCompaniesFilter.filters.$values
]));

const getMyCompaniesFx = attach({
  source: {
    filters: myCompaniesFilter.filters.$values,
    user: $authStore.map((val) => val.user),
    page: pagination.$currentPage,
    ordering: ordering.$ordering,
    size: pagination.$perPage
  },
  mapParams: (_, {
    filters, page, ordering, size, user
  }) => {
    let isManager = user?.id;
    if (user?.role.id === ROLE.ADMIN) {
      isManager = undefined;
    }
    return({
    page,
    size,
    ordering,
    manager: isManager, 
    search: filters.search,
    city: filters.company__city?.value.id,
    activity_types__rec_col_types: filters.activity_types__rec_col_types?.id.toString(),
    recyclables__recyclables: filters.recyclables__category?.id.toString(),
    ...(filters.createdAt[0] && { created_at__gte: filters.createdAt[0] }),
    ...(filters.createdAt[1] && { created_at__lte: filters.createdAt[1] }),
  })},
  effect: getCompaniesFx,
});

const resetMyCompaniesListEvent = createEvent();

const $myCompaniesList = createStore<companyModel.ICompany[]>([])
  .on(
    getCompaniesFx.doneData,
    (state, payload) => {
      if (payload.page && payload.page > 1) {
        return [
          ...state,
          ...payload.data.results
        ];
      }
      return payload.data.results;
    }

  ).reset(resetMyCompaniesListEvent);

sample({
  clock: ordering.setOrdering,
  target: resetMyCompaniesListEvent,
});

const runGetCompanyAfterStoreResetEvent = createEvent();

forward({
  from: resetMyCompaniesListEvent,
  to: runGetCompanyAfterStoreResetEvent,
});

sample({
  clock: [
    gate.open, 
    runGetCompanyAfterStoreResetEvent, 
    pagination.loadMore, 
    pagination.setPerPage, 
    myCompaniesFilter.filters.$values
  ],
  target: getMyCompaniesFx,
});

export {
  $myCompaniesList, gate, ordering, pagination, myCompaniesLoading 
};
