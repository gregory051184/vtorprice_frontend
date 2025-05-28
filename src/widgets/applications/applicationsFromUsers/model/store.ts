import {
  createEffect, createEvent, createStore, sample 
} from 'effector';
import { AxiosError } from 'axios/index';
import { applicationApi, applicationModel } from '@box/entities/application';
import { createList } from '@box/shared/lib/factories';
import { applicationsFromUsersListFiltersModel } from '@box/features/application';

const getApplications = (deal_type: 1 | 2) => async (params: 
Parameters<typeof applicationApi.getApplications>[0]) => {
  const { data } = await applicationApi.getApplications({
    ...params,
    deal_type
  });
  return data.results;
};

const setSelectedSales = createEvent<number>();
const setSelectedPurchase = createEvent<number>();
const resetSelection = createEvent();

const $selectedSales = createStore<null | number>(null)
  .on(setSelectedSales, (_, data) => data)
  .reset(resetSelection);
const $selectedPurchse = createStore<null | number>(null)
  .on(setSelectedPurchase, (_, data) => data)
  .reset(resetSelection);

const getPurchaseApplicationsFx = createEffect<
Parameters<typeof applicationApi.getApplications>[0], 
Array<applicationModel.IRecyclableApplication>,
AxiosError>({
  handler: getApplications(1)
});

const getSalesApplicationsFx = createEffect<
Parameters<typeof applicationApi.getApplications>[0], 
Array<applicationModel.IRecyclableApplication>,
AxiosError>({
  handler: getApplications(2)
});

const $salesApplications = createStore<Array<applicationModel.IRecyclableApplication>>([])
  .on(getSalesApplicationsFx.doneData, (_, data) => data);

const $purchaseApplications = createStore<Array<applicationModel.IRecyclableApplication>>([])
  .on(getPurchaseApplicationsFx.doneData, (_, data) => data);

const {
  ordering: salesOrdering, pagination: salesPagination, gate: salesGate, effect: effect2 
} = createList({
  effect: getSalesApplicationsFx,
  filters: applicationsFromUsersListFiltersModel.filters.$values,
  mapFilters: (filters) => ({
    price__lte: filters.price__lte,
    price__gte: filters.price__gte,
    ...(filters.total_weight__gte && { total_weight__gte: ((+filters.total_weight__gte) * 1000) }),
    ...(filters.total_weight__lte && { total_weight__lte: ((+filters.total_weight__lte) * 1000) }),
    city: filters.city?.value.id,
    urgency_type: filters.urgency_type.value as 1 | 2,
    application_recyclable_status: filters.application_recyclable_status?.value as 1 | 2,
    recyclables: filters.recyclables?.id ? [filters.recyclables?.id] as number[] : [],
    search: filters.search
  })
});

const {
  ordering: purchaseOrdering,
  pagination: purchasePagination, gate: purchaseGate,
  effect
} = createList({
  effect: getPurchaseApplicationsFx,
  filters: applicationsFromUsersListFiltersModel.filters.$values,
  mapFilters: (filters) => ({
    price__lte: filters.price__lte,
    price__gte: filters.price__gte,
    ...(filters.total_weight__gte && { total_weight__gte: ((+filters.total_weight__gte) * 1000) }),
    ...(filters.total_weight__lte && { total_weight__lte: ((+filters.total_weight__lte) * 1000) }),
    city: filters.city?.value.id,
    urgency_type: filters.urgency_type.value as 1 | 2,
    recyclables: filters.recyclables?.id ? [filters.recyclables?.id] as number[] : [],
    search: filters.search
  })
});

sample({
  clock: [effect.finally, effect2.finally],
  target: resetSelection
});

export const sales = {
  ordering: salesOrdering,
  pagination: salesPagination,
  gate: salesGate,
  applications: $salesApplications,
  selected: $selectedSales,
  setSelected: setSelectedSales
};

export const purchase = {
  ordering: purchaseOrdering,
  pagination: purchasePagination,
  gate: purchaseGate,
  applications: $purchaseApplications,
  selected: $selectedPurchse,
  setSelected: setSelectedPurchase
};
