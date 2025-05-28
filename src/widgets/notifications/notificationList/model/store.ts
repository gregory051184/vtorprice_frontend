import {companiesFavoritesFilter} from "@box/features/company/filters/copmaniesFavorites";
import {createPagination} from "@box/shared/lib/factories";
import {AxiosError} from "axios";
import {createGate} from "effector-react";
import {attach, createEffect, createEvent, createStore, merge, sample} from "effector";
import {notificationApi} from "@box/entities/notification/api/notificationApi";
import {INotification} from "@box/entities/notification/model";
import {createLoaderStore} from "@box/shared/lib/helpers";
import {createForm} from "@box/shared/effector-forms";
import {$authStore} from "@box/entities/auth";


const gate = createGate();

const getNotificationsUnreadCountFx = createEffect<
    null,
    {
        data: Awaited<ReturnType<typeof notificationApi.getNotificationsUnreadCount>>["data"];
        page?: number;
    } | null,
    AxiosError
>({
    handler: async () => {
        const auth = () => $authStore.getState();
        if (auth().user?.company?.id) {
            const {data} = await notificationApi.getNotificationsUnreadCount();
            return {
                data
            };
        }
        return null;
    },
});

const getNotificationsFx = createEffect<
    Parameters<typeof notificationApi.getNotifications>[0],
    {
        data: Awaited<ReturnType<typeof notificationApi.getNotifications>>["data"];
        page?: number;
    },
    AxiosError
>({
    handler: async (params) => {
        const {data} = await notificationApi.getNotifications(params);
        return {
            data,
            page: params.page,
        };
    },
});

const getOneNotificationFx = createEffect<
    number,
    {
        data: Awaited<
            ReturnType<typeof notificationApi.getOneNotification>
        >["data"];
    },
    AxiosError
>({
    handler: async (params) => {
        const {data} = await notificationApi.getOneNotification(params);
        return {
            data,
        };
    },
});

const notificationsLoading = createLoaderStore(false, getNotificationsFx);

const pagination = createPagination(
    getNotificationsFx,
    merge([gate.close, companiesFavoritesFilter.filters.$values])
);

const filters = createForm({
    fields: {
        search: {
            init: "",
        },
    },
});

const getNotifications = attach({
    source: {
        search: filters.fields.search.$value,
        page: pagination.$currentPage,
        size: pagination.$perPage,
    },
    mapParams: (_, {search, page, size}) => ({
        search,
        page,
        size,
    }),
    effect: getNotificationsFx,
});

const deleteNotificationFx = createEffect<number, number | null, AxiosError>({
    handler: async (id) => {
        await notificationApi.removeNotification(id);
        return id;
    },
});

const $notificationsList = createStore<INotification[]>([]).on(
    getNotificationsFx.doneData,
    (store, payload) => {
        if (payload.page && payload.page > 1) {
            return [...store, ...payload.data.results];
        }
        return [...payload.data.results];
    })
    .on(deleteNotificationFx.doneData, (state, id) => (
        id !== null ? state.filter((el) => el.id !== id) : state));

const $notificationsUnreadCount = createStore<number | null>(null).on(
    getNotificationsUnreadCountFx.doneData,
    (_, payload) => {
        if(payload !== null) {
            return payload.data.unreadCount;
        }
        return null
    }
);

sample({
    clock: [
        gate.open,
        getOneNotificationFx.finally,
        pagination.loadMore,
        pagination.setPerPage,
        filters.$values,
    ],
    target: getNotifications,
});

const mainNotificationsEvent = createEvent();

sample({
    // @ts-ignore
    clock: [mainNotificationsEvent, getOneNotificationFx.finally],
    target: getNotificationsUnreadCountFx,
});

export {
    mainNotificationsEvent,
    $notificationsList,
    $notificationsUnreadCount,
    gate,
    getOneNotificationFx,
    pagination,
    notificationsLoading,
    filters,
    deleteNotificationFx
};
