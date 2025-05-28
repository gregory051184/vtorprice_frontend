import {
  attach, createEffect, createStore, merge, sample 
} from 'effector';
import { IEquipmentApplication } from '@box/entities/application/model/types';
import { AxiosError } from 'axios';
import {equiomentApplicationApi} from '@box/entities/application';
import { createLoaderStore } from '@box/shared/lib/helpers';
import { createGate } from 'effector-react';
import { createOrdering, createPagination } from '@box/shared/lib/factories';
import { equipmentsListFiltersModel } from '@box/features/application/filters/equipmentApplications';
  
const gate = createGate();
const ordering = createOrdering();

const getEquipmentApplicationsFx = createEffect<
Parameters<typeof equiomentApplicationApi.getEquipmentApplications>[0]
, {
  data: Awaited<ReturnType<typeof equiomentApplicationApi.getEquipmentApplications>>['data'],
  page?: number
}, AxiosError>({
  handler: async (params) => {
    const { data } = await equiomentApplicationApi.getEquipmentApplications(params);
    return {
      data,
      page: params.page
    };
  }
});

const pagination = createPagination(getEquipmentApplicationsFx, merge([
  gate.close,
  equipmentsListFiltersModel.filters.$values
]));

const updateIsFavoriteEquipmentApplicationFx = createEffect<
Parameters<typeof equiomentApplicationApi.updateEquipmentApplicationInFavorite>[0]
, IEquipmentApplication, AxiosError>({
  handler: async (params) => {
    const { data } = await equiomentApplicationApi.updateEquipmentApplicationInFavorite(params);
    return data;
  }
});

const getEquipmentApplications = attach({
  source: {
    filters: equipmentsListFiltersModel.filters.$values,
    page: pagination.$currentPage,
    ordering: ordering.$ordering,
    size: pagination.$perPage
  },
  mapParams: (_, {
    filters, page, size, ordering
  }) => ({
    page,
    size,
    ordering,
    deal_type: filters.deal_type?.value,
    equipment__category: filters.equipment_type?.value,
    city: filters.city?.value.id,
    ...(filters.search && { search: filters.search }),
    ...(filters.count && { count__gte: +filters.count }),
    ...(filters.created_at[0] && { created_at__gte: filters.created_at[0].toJSON().split('T')[0] }),
    ...(filters.created_at[1] && { created_at__lte: filters.created_at[1].toJSON().split('T')[0] }),
    ...(filters.price__gte && { price__gte: +filters.price__gte }),
    ...(filters.price__lte && { price__lte: +filters.price__lte }),
  }),
  effect: getEquipmentApplicationsFx,
});
  
const equipmentApplicationsLoading = createLoaderStore(false, getEquipmentApplicationsFx);
  
const $equipmentApplications = createStore<Array<IEquipmentApplication>>([])
  .on(getEquipmentApplicationsFx.doneData, (state, data) => {
    if (data.page && data.page > 1) {
      return [
        ...state,
        ...data.data.results
      ];
    }
    return data.data.results;
  })
  .on(updateIsFavoriteEquipmentApplicationFx.doneData, (state, data) => {
    const updatedApplicationIndex = state.findIndex((el) => el.id === data.id);
    if (updatedApplicationIndex != null) {
      const newState = [...state];
      newState[updatedApplicationIndex] = data;
      return newState;
    }
    return state;
  });

sample({
  clock: [gate.open, equipmentsListFiltersModel.filters.$values, 
    pagination.loadMore, ordering.setOrdering],
  target: getEquipmentApplications,
});

export {
  gate,
  ordering,
  pagination,
  $equipmentApplications,
  equipmentApplicationsLoading,
  getEquipmentApplicationsFx,
  updateIsFavoriteEquipmentApplicationFx
};
