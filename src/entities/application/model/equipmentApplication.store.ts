import {createEffect, createEvent, createStore} from 'effector';
import Router from 'next/router';
import {IEquipmentApplication} from '@box/entities/application/model/types';
import {AxiosError} from 'axios';
import {equiomentApplicationApi} from '@box/entities/application';
import {createLoaderStore} from '@box/shared/lib/helpers';

const getEquipmentApplicationsFx = createEffect<
    Parameters<typeof equiomentApplicationApi.getEquipmentApplications>[0]
    , {
    data: Awaited<ReturnType<typeof equiomentApplicationApi.getEquipmentApplications>>['data'],
    page?: number
}, AxiosError>({
    handler: async (params) => {
        if (Router.asPath === '/profile/applications' || Router.asPath ==='profile/applications-management') {
            const {data} = await equiomentApplicationApi.getEquipmentApplicationsForMyProfile(params)
            return {
                data,
                page: params.page,
            };
        }
        const {data} = await equiomentApplicationApi.getEquipmentApplications(params);
        return {
            data,
            page: params.page
        };
    }
});

const getEquipmentApplicationFx = createEffect<
    Parameters<typeof equiomentApplicationApi.getEquipmentApplication>[0],
    IEquipmentApplication, AxiosError>({
    handler: async (id) => {
        const {data} = await equiomentApplicationApi.getEquipmentApplication(id);
        return data;
    }
});

const updateEquipmentApplicationFx = createEffect<
    Parameters<typeof equiomentApplicationApi.upadateEquipmentApplication>[0]
    , IEquipmentApplication, AxiosError>({
    handler: async (params) => {
        const {data} = await equiomentApplicationApi.upadateEquipmentApplication(params);
        return data;
    }
});

const updateIsFavoriteEquipmentApplicationFx = createEffect<
    Parameters<typeof equiomentApplicationApi.updateEquipmentApplicationInFavorite>[0]
    , IEquipmentApplication, AxiosError>({
    handler: async (params) => {
        const {data} = await equiomentApplicationApi.updateEquipmentApplicationInFavorite(params);
        return data;
    }
});

const deleteEquipmentApplicationFx = createEffect<number, number | null, AxiosError>({
    handler: async (id) => {
        await equiomentApplicationApi.deleteEquipmentApplication(id);
        return id;
    }
});

const postEquipmentsImagesFx = createEffect<
    { id: number, images: Array<File | null | string> }
    , { image: string } | null, AxiosError>({
    handler: async ({id, images}) => {
        const {data} = await equiomentApplicationApi.setEquipmentApplicationImage(images, id);
        Router.back();
        return data;
    }
});

const equipmentApplicationsLoading = createLoaderStore(false, getEquipmentApplicationsFx);

const resetEquipmentApplicationsListEvent = createEvent();

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
        const newState = [...state];
        const updatedApplicationIndex = newState.findIndex((el) => el.id === data.id);
        if (updatedApplicationIndex) {
            newState[updatedApplicationIndex] = data;
        }
        return newState;
    })
    .on(updateEquipmentApplicationFx.doneData, (state, data) => {
        const newState = [...state];
        const updatedApplicationIndex = newState.findIndex((el) => el.id === data.id);
        if (updatedApplicationIndex) {
            newState[updatedApplicationIndex] = data;
        }
        return newState;
    })
    .on(deleteEquipmentApplicationFx.doneData, (state, id) => (
        id !== null ? state.filter((el) => el.id !== id) : state))
    .on(getEquipmentApplicationsFx.failData, () => [])
    .reset(resetEquipmentApplicationsListEvent);

const $equipmentApplication = createStore<IEquipmentApplication | null>(null)
    .on(getEquipmentApplicationFx.doneData, (_, data) => data)
    .on(updateIsFavoriteEquipmentApplicationFx.doneData, (_, data) => data);


export {
    $equipmentApplication,
    $equipmentApplications,
    deleteEquipmentApplicationFx,
    updateEquipmentApplicationFx,
    postEquipmentsImagesFx,
    equipmentApplicationsLoading,
    getEquipmentApplicationsFx,
    getEquipmentApplicationFx,
    updateIsFavoriteEquipmentApplicationFx,
    resetEquipmentApplicationsListEvent
};
