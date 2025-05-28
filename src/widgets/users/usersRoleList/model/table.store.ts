import { AxiosError } from "axios";
import { createGate } from "effector-react";
import { attach, createEffect, createStore, merge, sample } from "effector";

import { createOrdering, createPagination } from "@box/shared/lib/factories";
import { createLoaderStore } from "@box/shared/lib/helpers";
import {
  IUserWithRole,
  statisticApi,
} from "@box/entities/statistics/api/statisticApi";
import { authApi } from "@box/entities/auth";
import { createForm } from "@box/shared/effector-forms";

const gate = createGate();
const ordering = createOrdering();

const filters = createForm({
  fields: {
    search: {
      init: "",
    },
  },
});

const getAllUsersFx = createEffect<
  Parameters<typeof statisticApi.getAllUsers>[0],
  {
    data: Awaited<ReturnType<typeof statisticApi.getAllUsers>>["data"];
    page?: number;
  },
  AxiosError
>({
  handler: async (params) => {
    const { data } = await statisticApi.getAllUsers(params);

    return {
      data,
      page: params.page,
    };
  },
});

const updateUserRoleFx = createEffect<
  Parameters<typeof authApi.updateUserRole>[0],
  {
    data: Awaited<ReturnType<typeof authApi.updateUserRole>>["data"];
    page?: number;
  },
  AxiosError
>({
  handler: async (params) => {
    const { data } = await authApi.updateUserRole(params);

    return {
      data,
    };
  },
});

const allUsersLoading = createLoaderStore(false, getAllUsersFx);

const pagination = createPagination(
  getAllUsersFx,
  merge([gate.close, filters.$values])
);

const getAllUsers = attach({
  source: {
    search: filters.fields.search.$value,
    page: pagination.$currentPage,
    ordering: ordering.$ordering,
    size: pagination.$perPage,
  },
  mapParams: (_, source) => source,
  effect: getAllUsersFx,
});

const $allUsers = createStore<IUserWithRole[]>([])
  .on(getAllUsersFx.doneData, (store, payload) => {
    if (payload.page && payload.page > 1) {
      return [...store, ...payload.data.results];
    }
    return payload.data.results;
  })
  .on(updateUserRoleFx.doneData, (store, payload) => {
    const newStore = [...store];
    const changedUserIndex = store.findIndex(
      (user) => user.id === payload.data.id
    );
    if (changedUserIndex != null) {
      newStore[changedUserIndex].role = payload.data.role;
    }
    return newStore;
  });

sample({
  clock: [
    gate.open,
    pagination.loadMore,
    pagination.setPerPage,
    filters.$values,
    ordering.setOrdering,
  ],
  target: getAllUsers,
});

export {
  $allUsers,
  allUsersLoading,
  filters,
  gate,
  ordering,
  pagination,
  updateUserRoleFx,
};
