import { AxiosError } from "axios";
import { createGate } from "effector-react";
import { attach, createEffect, createStore, merge, sample } from "effector";

import { createOrdering, createPagination } from "@box/shared/lib/factories";
import { createLoaderStore } from "@box/shared/lib/helpers";
import { logisticsApplicationsApi } from "@box/entities/logistics/api/logistApi";
import { ITransportApplicationModel } from "@box/entities/logistics/model";
import { logistActiveTransportApplicationsListFiltersModel } from "@box/features/application/filters/logistTransportDeals";

const gate = createGate();
const ordering = createOrdering();

const getTransportApplicationsFx = createEffect<
  Parameters<typeof logisticsApplicationsApi.getApplications>[0],
  {
    data: Awaited<
      ReturnType<typeof logisticsApplicationsApi.getApplications>
    >["data"];
    page?: number;
  },
  AxiosError
>({
  handler: async (params) => {
    const { data } = await logisticsApplicationsApi.getApplications(params);

    return {
      data,
      page: params.page,
    };
  },
});

const transportAppplicationsLoading = createLoaderStore(
  false,
  getTransportApplicationsFx
);

const pagination = createPagination(
  getTransportApplicationsFx,
  merge([
    gate.close,
    logistActiveTransportApplicationsListFiltersModel.filters.$values,
  ])
);

const getTransportApplications = attach({
  source: {
    filters: logistActiveTransportApplicationsListFiltersModel.filters.$values,
    page: pagination.$currentPage,
    ordering: ordering.$ordering,
    size: pagination.$perPage,
  },
  mapParams: (_, { filters, page, ordering, size }) => ({
    page,
    size,
    ordering,
    search: filters.search,
    logistStatus: [2],
    ...(filters.createdAt[0] && {created_at__gte: filters.createdAt[0]}),
    ...(filters.createdAt[1] && {created_at__lte: filters.createdAt[1]}),
    ...(filters.price__gte && {approved_logistics_offer__amount__gte: filters.price__gte}),
    ...(filters.price__lte && {approved_logistics_offer__amount__lte: filters.price__lte}),
    ...((filters.status ? { status: [filters.status.value] } : {status: [2, 3, 4, 5]})),
  }),
  effect: getTransportApplicationsFx,
});

const $transportApplications = createStore<ITransportApplicationModel[]>([]).on(
  getTransportApplicationsFx.doneData,
  (state, payload) => {
    if (payload.page && payload.page > 1) {
      return [...state, ...payload.data.results];
    }
    return payload.data.results;
  }
);

const searchFieldValue =
  logistActiveTransportApplicationsListFiltersModel.filters.fields.search
    .$value;
const resetForm =
  logistActiveTransportApplicationsListFiltersModel.filters.reset;

sample({
  clock: [
    gate.open,
    pagination.loadMore,
    pagination.setPerPage,
    searchFieldValue,
    logistActiveTransportApplicationsListFiltersModel.applyTableFilters,
    resetForm,
    ordering.setOrdering,
  ],
  target: getTransportApplications,
});

sample({
  clock: gate.close,
  target: logistActiveTransportApplicationsListFiltersModel.filters.reset,
});

export {
  $transportApplications,
  transportAppplicationsLoading,
  gate,
  ordering,
  pagination,
};
