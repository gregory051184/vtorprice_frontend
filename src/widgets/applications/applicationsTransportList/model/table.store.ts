import { AxiosError } from 'axios';
import { createGate } from 'effector-react';
import {
  attach,
  createEffect,
  createStore,
  merge,
  sample,
} from 'effector';

import { createOrdering, createPagination } from '@box/shared/lib/factories';
import { createLoaderStore } from '@box/shared/lib/helpers';
import { logistTransportApplicationListFiltersModel } from '@box/features/application';
import { logisticsApplicationsApi } from '@box/entities/logistics/api/logistApi';
import { ITransportApplicationModel } from '@box/entities/logistics/model';

const gate = createGate();
const ordering = createOrdering();

const getTransportApplicationsFx = createEffect<
Parameters<typeof logisticsApplicationsApi.getApplications>[0]
, {
  data: Awaited<ReturnType<typeof logisticsApplicationsApi.getApplications>>['data'],
  page?: number
}, AxiosError>({
  handler: async (params) => {
    const { data } = await logisticsApplicationsApi.getApplications(params);

    return {
      data,
      page: params.page
    };
  }
});

const transportAppplicationsLoading = createLoaderStore(false, getTransportApplicationsFx);

const pagination = createPagination(getTransportApplicationsFx, merge([
  gate.close,
  logistTransportApplicationListFiltersModel.filters.$values
]));

const getTransportApplications = attach({
  source: {
    filters: logistTransportApplicationListFiltersModel.filters.$values,
    page: pagination.$currentPage,
    ordering: ordering.$ordering,
    size: pagination.$perPage
  },
  mapParams: (_, {
    filters, page, ordering, size 
  }) => ({
    page,
    size,
    ordering,
    search: filters.search,
    delivery_city: filters.delivery_city?.id.toString(),
    shipping_city: filters.shipping_city?.id.toString(),
    ...(filters.status && { status: [filters.status.value]}),
    ...(filters.logistStatus && { logistStatus: [filters.logistStatus.value]}),
    ...(filters.createdAt.every((el) => el !== null)
        && { created_at__gte: filters.createdAt[0] || undefined }
    ),
    ...(filters.createdAt.every((el) => el !== null)
        && { created_at__lte: filters.createdAt[1] || undefined }
    ),

  }),
  effect: getTransportApplicationsFx,
});

const $transportApplications = createStore<ITransportApplicationModel[]>([])
  .on(
    getTransportApplicationsFx.doneData,
    (state, payload) => {
      if (payload.page && payload.page > 1) {
        return [
          ...state,
          ...payload.data.results,
        ];
      }
      return payload.data.results;
    }
  );

const searchFieldValue = logistTransportApplicationListFiltersModel.filters.fields.search.$value;
const resetForm = logistTransportApplicationListFiltersModel.filters.reset;

sample({
  clock: [gate.open, pagination.loadMore, pagination.setPerPage,
    searchFieldValue, logistTransportApplicationListFiltersModel.applyTableFilters, 
    resetForm, ordering.setOrdering],
  target: getTransportApplications,
});

sample({
  clock: gate.close,
  target: logistTransportApplicationListFiltersModel.filters.reset
})

export {
  $transportApplications,
  getTransportApplications,
  transportAppplicationsLoading,
  gate, 
  ordering, 
  pagination, 
};
