import {AxiosError} from "axios";
import {createGate} from "effector-react";
import {attach, createEffect, createStore, merge, sample} from "effector";

import {createOrdering, createPagination} from "@box/shared/lib/factories";
import {createLoaderStore} from "@box/shared/lib/helpers";
import {
    IUserWithRole,
    statisticApi,
} from "@box/entities/statistics/api/statisticApi";
import {authApi} from "@box/entities/auth";
import {createForm} from "@box/shared/effector-forms";
import {IManagersActions, IUser} from "@box/entities/user";
import {managersFilters} from "@box/entities/user/filters";


const gate = createGate();
const managersGate = createGate();
const managersActionsGate = createGate();
const ordering = createOrdering();

const filters = createForm({
    fields: {
        search: {
            init: "",
        },
    },
});


const getAllManagersFx = createEffect<
    Parameters<typeof authApi.getOnlyManagers>[0],
    {
        data: Awaited<ReturnType<typeof authApi.getOnlyManagers>>["data"];
        page?: number;
        size?: number;
    },
    AxiosError
>({
    handler: async (params) => {
        const {data} = await authApi.getOnlyManagers(params);

        return {
            data,
        };
    },
});


const getAllManagersActionsFx = createEffect<
    Parameters<typeof authApi.getOnlyManagersActions>[0],
    {
        data: Awaited<ReturnType<typeof authApi.getOnlyManagersActions>>["data"];
    },
    AxiosError
>({
    handler: async (params) => {
        const {data} = await authApi.getOnlyManagersActions(params);

        return {
            data,
        };
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
        const {data} = await statisticApi.getAllUsers(params);

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
        const {data} = await authApi.updateUserRole(params);

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

const companiesLoading = createLoaderStore(false, getAllManagersFx)


const getAllManagersActionsWithParamsFx = attach({
    source: {
        filters: managersFilters.$values,
    },
    mapParams: (_, {
        filters
    }) => ({
        ...(filters.created_at[0] && { created_at__gte: filters.created_at[0].toJSON().split('T')[0] }),
        ...(filters.created_at[1] && { created_at__lte: filters.created_at[1].toJSON().split('T')[0] }),
        // created_at__gte: filters.created_at[0] || undefined,
        // created_at__lte: filters.created_at[1] || undefined
        // ...(filters.created_at.every((el) => el !== null)
        //     && {created_at__gte: filters.created_at[0] || undefined}
        // ),
        // ...(filters.created_at.every((el) => el !== null)
        //     && {created_at__lte: filters.created_at[1] || undefined}
        // )
    }),
    effect: getAllManagersActionsFx
})


const $allManagers = createStore<IUser[]>([])
    .on(getAllManagersFx.doneData, (state, payload) => payload.data)


const $allManagersActions = createStore<IManagersActions[]>([])
    .on(getAllManagersActionsFx.doneData, (state, payload) => payload.data)


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

sample({
    //@ts-ignore
    clock: managersGate.open,
    target: getAllManagersFx
});

sample({
    //@ts-ignore
    clock: [managersActionsGate.open, managersFilters.$values],
    target: getAllManagersActionsWithParamsFx
});

export {
    $allUsers,
    allUsersLoading,
    filters,
    gate,
    ordering,
    pagination,
    updateUserRoleFx,
    $allManagers,
    managersGate,
    $allManagersActions,
    managersActionsGate,
    companiesLoading
};
