import { AxiosError } from 'axios';
import { createGate } from 'effector-react';
import {
  attach,
  createEffect,
  createEvent,
  createStore,
  merge,
  sample,
} from 'effector';

import { createOrdering, createPagination } from '@box/shared/lib/factories';
import { applicationApi, applicationModel } from '@box/entities/application';
import { IRecyclableApplication } from '@box/entities/application/model';
import { usersApplicationsFavoriteListFiltersModel } from '@box/features/application/filters/usersApplicationsFavorites';
import { createLoaderStore } from '@box/shared/lib/helpers';

const gate = createGate();
const ordering = createOrdering();
const requestEv = createEvent();

const getApplicationsFx = createEffect<
Parameters<typeof applicationApi.getApplications>[0]
, {
  data: Awaited<ReturnType<typeof applicationApi.getApplications>>['data'],
  page?: number
}, AxiosError>({
  handler: async (params) => {
    const { data } = await applicationApi.getApplications(params);

    return {
      data,
      page: params.page
    };
  }
});

const favoriteAppplicationsLoading = createLoaderStore(false, getApplicationsFx);

const updateApplicationInFavoriteFx = createEffect<
Parameters<typeof applicationApi.updateApplicationInFavorite>[0],
IRecyclableApplication, AxiosError>({
  handler: async (params) => {
    const { data } = await applicationApi.updateApplicationInFavorite(params);
    return data;
  }
});

const pagination = createPagination(getApplicationsFx, merge([
  gate.close,
  usersApplicationsFavoriteListFiltersModel.filters.$values
]));

const getFavoritesApplicationFx = attach({
  source: {
    filters: usersApplicationsFavoriteListFiltersModel.filters.$values,
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
    is_favorite: true,
    search: filters.search,
    created_at__gte: filters.createdAt[0],
    created_at__lte: filters.createdAt[1],
    activity_types__rec_col_types: filters.activity_types__rec_col_types?.value.id.toString(),
    urgency_typ: filters.urgency_type?.value,
    deal_type: filters.deal_type?.value,
    application_recyclable_status: filters.application_recyclable_status?.value,
    city: filters.company__city?.value.id,
    recyclables__category: filters.recyclables?.value.id,
  }),
  effect: getApplicationsFx,
});

const $getFavoritesApplicationFx = createStore<applicationModel.IRecyclableApplication[]>([])
  .on(
    getFavoritesApplicationFx.doneData,
    (_, payload) => [...payload.data.results]
  )
  .on(updateApplicationInFavoriteFx.doneData, (store, data) => {
    const newStore = [...store];
    const uppdateCopmanyIndex = newStore.findIndex((el) => el.id === data.id);
    newStore[uppdateCopmanyIndex] = data;
    return newStore;
  });

const searchFieldValue = usersApplicationsFavoriteListFiltersModel.filters.fields.search.$value;
const resetForm = usersApplicationsFavoriteListFiltersModel.filters.reset;

sample({
  clock: [requestEv, gate.open, pagination.loadMore,
    searchFieldValue, usersApplicationsFavoriteListFiltersModel.applyFavoritesFilters, 
    resetForm, ordering.setOrdering],
  target: getFavoritesApplicationFx,
});

export {
  $getFavoritesApplicationFx, updateApplicationInFavoriteFx, 
  requestEv, gate, ordering, pagination, favoriteAppplicationsLoading
};
