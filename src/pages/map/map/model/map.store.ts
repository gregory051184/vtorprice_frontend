import {
  attach,
  createEffect,
  createEvent,
  createStore,
  sample,
  split,
} from "effector";
import { mapApplicationFiltersModel } from "@box/features/map";
import { applicationModel } from "@box/entities/application";
import {
  IEquipmentApplication,
  IRecyclableApplication,
} from "@box/entities/application/model";
import { createGate } from "effector-react";
import { cityApi } from "@box/entities/city";
import { AxiosError } from "axios";
import { ICity } from "@box/entities/city/model";

const gate = createGate();

const getRecyclablesApplications = attach({
  source: {
    filters: mapApplicationFiltersModel.filters.$values,
  },
  mapParams: (_, { filters }) => {
    return({
      size: 1000000,
      urgency_type: filters.urgency_type?.value,
      recyclables__category: filters.recyclables__category?.value.id,
      deal_type: filters.deal_type?.value,
      ...(filters.weight && { total_weight__lte: filters.weight }),
      city: filters.city?.value.id,
      city__region__district: filters?.district?.value?.id,
      city__region: filters?.region?.value?.id,
    })
  },

  effect: applicationModel.getApplicationsFx,
});

const getEquipmentApplications = attach({
  source: {
    filters: mapApplicationFiltersModel.filters.$values,
  },
  mapParams: (_, { filters }) => ({
    size: 1000000,
    equipment__category: filters.equipment__category?.value,
    deal_type: filters.deal_type?.value,
    ...(filters.count && { count__gte: +filters.count }),
    city: filters.city?.value.id,
    city__region__district: filters?.district?.value?.id,
    city__region: filters?.region?.value?.id,
  }),
  effect: applicationModel.getEquipmentApplicationsFx,
});

const getCityInfoFx = createEffect<
  number,
  {
    data: Awaited<ReturnType<typeof cityApi.getCityInfo>>["data"];
  },
  AxiosError
>({
  handler: async (params) => {
    const { data } = await cityApi.getCityInfo({ id: params });
    return {
      data,
    };
  },
});

const getCityInfo = attach({
  source: {
    filters: mapApplicationFiltersModel.filters.$values,
  },
  mapParams: (_, { filters }) => {
    if (filters.city?.id) {
      return +filters.city?.id;
    }
    return 1;
  },
  effect: getCityInfoFx,
});

const $applications = createStore<
  Array<IRecyclableApplication | IEquipmentApplication>
>([])
  .on(getEquipmentApplications.doneData, (_, data) => data.data.results)
  .on(getRecyclablesApplications.doneData, (_, data) => data.data.results);

split({
  source: mapApplicationFiltersModel.applicationType,
  match: (value) => value.value,
  cases: {
    1: [getEquipmentApplications, mapApplicationFiltersModel.filters.reset],
    2: [getRecyclablesApplications, mapApplicationFiltersModel.filters.reset]
  },
});

sample({
  clock: gate.open,
  target: getEquipmentApplications,
});

split({
  source: mapApplicationFiltersModel.applyMapApplicationFilters,
  match: (value) => value,
  cases: {
    1: [getEquipmentApplications, getCityInfo],
    2: [getRecyclablesApplications, getCityInfo],
  },
});

split({
  source: mapApplicationFiltersModel.resetMapApplicationFilters,
  match: (value) => value,
  cases: {
    1: getEquipmentApplications,
    2: getRecyclablesApplications,
  },
});

const findApplicationInList = createEvent<Array<number>>();
const clearApplicationInList = createEvent();

const $seachApplication = createStore<
  Array<IRecyclableApplication | IEquipmentApplication>
>([]).on(clearApplicationInList, () => []);

const $infoAboutCity = createStore<ICity | null>(null).on(
  getCityInfoFx.doneData,
  (_, payload) => {
    return payload.data;
  }
);

sample({
  source: $applications,
  clock: findApplicationInList,
  fn: (source, clock) => {
    const findApplications = source.filter((item) => {
      const haveSameId = clock.some((filterItem) => filterItem === item.id);
      return haveSameId;
    });
    return findApplications;
  },
  target: $seachApplication,
});

sample({ 
  clock: gate.close,
  target: [clearApplicationInList,mapApplicationFiltersModel.filters.reset],
});

export {
  gate,
  $applications,
  $infoAboutCity,
  $seachApplication,
  getCityInfoFx,
  getRecyclablesApplications,
  getEquipmentApplications,
  findApplicationInList,
  clearApplicationInList,
};
