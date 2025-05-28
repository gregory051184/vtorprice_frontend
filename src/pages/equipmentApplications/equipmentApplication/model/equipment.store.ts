import {
  applicationModel,
  equiomentApplicationApi,
} from "@box/entities/application";
import { IEquipmentApplication } from "@box/entities/application/model";
import { AxiosError } from "axios";
import { createEffect, createStore, sample } from "effector";
import { createGate } from "effector-react";

const gate = createGate<{ id: number }>();

const getEquipmentApplicationsFx = createEffect<
  applicationModel.IEquipmentApplication | null,
  Array<IEquipmentApplication>,
  AxiosError
>({
  handler: async (application) => {
    if (application) {
      const { data } = await equiomentApplicationApi.getEquipmentApplications({
        deal_type: application.dealType.id,
        city: application.city,
      });
      return data.results;
    }
    return [];
  },
});

const getEquipmentApplicationFx = createEffect<
  Parameters<typeof equiomentApplicationApi.getEquipmentApplication>[0],
  IEquipmentApplication,
  AxiosError
>({
  handler: async (id) => {
    const { data } = await equiomentApplicationApi.getEquipmentApplication(id);
    return data;
  },
});

const updateIsFavoriteEquipmentApplicationFx = createEffect<
  Parameters<
    typeof equiomentApplicationApi.updateEquipmentApplicationInFavorite
  >[0],
  IEquipmentApplication,
  AxiosError
>({
  handler: async (params) => {
    const { data } =
      await equiomentApplicationApi.updateEquipmentApplicationInFavorite(
        params
      );
    return data;
  },
});

const $equipmentApplications = createStore<Array<IEquipmentApplication>>([]).on(
  getEquipmentApplicationsFx.doneData,
  (state, data) => {
    return data;
  }
);

const $equipmentApplication = createStore<IEquipmentApplication | null>(null)
  .on(getEquipmentApplicationFx.doneData, (_, data) => data)
  .on(updateIsFavoriteEquipmentApplicationFx.doneData, (store, data) => {
    if (store) {
      const newDate = { ...store, isFavorite: data.isFavorite };
      return newDate;
    }
    return data;
  });

sample({
  source: gate.open,
  fn: (clock) => Number(clock.id),
  target: getEquipmentApplicationFx,
});

sample({
  source: $equipmentApplication,
  filter: (application) => application !== null,
  target: getEquipmentApplicationsFx,
});

export {
  gate,
  $equipmentApplication,
  $equipmentApplications,
  getEquipmentApplicationFx,
  updateIsFavoriteEquipmentApplicationFx,
};
