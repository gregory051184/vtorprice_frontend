import {createEffect, createEvent, createStore, merge, sample} from "effector";
import {IRecyclableApplication, IRecyclableApplicationShortForAll} from "@box/entities/application/model/types";
import {AxiosError} from "axios";
import {
    applicationApi,
    applicationModel,
} from "@box/entities/application";
import {createLoaderStore} from "@box/shared/lib/helpers";
import Router from 'next/router';
import {notificationModel} from '@box/entities/notification';
import {createGate} from "effector-react";
import {createPagination} from "@box/shared/lib/factories";


const gate = createGate();
const allApplicationsGate = createGate();

const getApplicationFx = createEffect<
    Parameters<typeof applicationApi.getApplication>[0],
    IRecyclableApplication,
    AxiosError
>({
    handler: async (id) => {
        const {data} = await applicationApi.getApplication(id);
        return data;
    },
});


const getAllApplicationsFx = createEffect<
    Parameters<typeof applicationApi.getAllApplications>[0], IRecyclableApplicationShortForAll, AxiosError>({
        handler: async (params) => {
            const router = Router
            //ДЛЯ ПЕРЕКЛЮЧЕНИЯ НА ОТХОДЫ ИЛИ ГРАНУЛУ ПРИ ПЕРЕХОДЕ НА СТРАНИЦУ ИМЕННО С ОХОДАМИ ИЛИ С ГРАНУЛОЙ
            if (router.asPath.split('/').includes("wastes")) {
                params["application_recyclable_status"] = 1
            }
            if (router.asPath.split('/').includes("granule")) {
                params["application_recyclable_status"] = 2
            }
            //Для передачи категории
            if (+router.asPath.split('/')[router.asPath.split('/').length - 1] > 0 &&
                (+router.asPath.split('/').length === 4 || +router.asPath.split('/').length === 6)) {
                params['category'] = router.asPath.split('/')[router.asPath.split('/').length - 1];
            }
            //Для передачи субкатегории
            if (+router.asPath.split('/')[router.asPath.split('/').length - 1] > 0 &&
                (+router.asPath.split('/').length === 5 || +router.asPath.split('/').length === 7)) {
                params['sub_category'] = router.asPath.split('/')[router.asPath.split('/').length - 1];
            }
            const {data} = await applicationApi.getAllApplications(params)
            return data
        }
    }
)

// @ts-ignore
// eslint-disable-next-line
const $allApplicationsWithoutPages = createStore<Array<IRecyclableApplicationShortForAll>>([])
    .on(getAllApplicationsFx.doneData, (state, data) => {
        return data
    })


const getApplicationsFx = createEffect<
    Parameters<typeof applicationApi.getApplications>[0],
    {
        data: Awaited<ReturnType<typeof applicationApi.getApplications>>["data"];
        page?: number;
    },
    AxiosError
>({

    handler: async (params) => {
        //ДОБАВИЛ
        if (Router.asPath === 'profile/applications' || Router.asPath === 'profile/applications-management') {
            const {data} = await applicationApi.getApplicationsForMyProfile(params)
            if (params.company_rating) {
                //@ts-ignore
                const results = data.results.filter(app => app.company.averageReviewRate >= +params?.company_rating);
                data.results = results

            }
            return {
                data,
                page: params.page,
            };
        }
        const {data} = await applicationApi.getApplications(params);
        if (params.company_rating) {
            //@ts-ignore
            const results = data.results.filter(app => app.company.averageReviewRate >= +params?.company_rating);
            data.results = results
        }
        return {
            data,
            page: params.page,
        };
    },
});

const pagination = createPagination(getApplicationsFx, merge([
    gate.close,
]));

const applicationsLoading = createLoaderStore(false, getApplicationsFx);

const updateApplicationEvent =
    createEvent<Parameters<typeof applicationApi.setApplication>[0]>();

const updateApplicationFx = createEffect<
    Parameters<typeof applicationApi.setApplication>[0],
    applicationModel.IRecyclableApplication,
    AxiosError
>({
    handler: async (params) => {
        const {data} = await applicationApi.setApplication(params);
        return data;
    },
});

const updateIsFavoriteApplicationFx = createEffect<
    Parameters<typeof applicationApi.updateApplicationInFavorite>[0],
    applicationModel.IRecyclableApplication,
    AxiosError
>({
    handler: async (params) => {
        const {data} = await applicationApi.updateApplicationInFavorite(params);
        return data;
    },
});

const deleteApplicationFx = createEffect<number, number | null, AxiosError>({
    handler: async (id) => {
        await applicationApi.deleteApplication(id);
        return id;
    },
});

const resetApplicationsListEvent = createEvent();


const $applications = createStore<Array<IRecyclableApplication>>([])

    .on(getApplicationsFx.doneData, (state, data) => {
        if (data.page && data.page > 1) {
            return [...state, ...data.data.results];
        }
        return data.data.results;
    })
    .on(updateApplicationFx.doneData, (state, data) => {
        const newState = [...state];
        const updatedApplicationIndex = newState.findIndex(
            (el) => el.id === data.id
        );
        if (updatedApplicationIndex) {
            newState[updatedApplicationIndex] = data;
        }
        return newState;
    })
    .on(updateIsFavoriteApplicationFx.doneData, (state, data) => {
        const newState = [...state];
        const updatedApplicationIndex = newState.findIndex(
            (el) => el.id === data.id
        );
        if (updatedApplicationIndex) {
            newState[updatedApplicationIndex] = data;
        }
        return newState;
    })
    .on(deleteApplicationFx.doneData, (store, id) =>
        id !== null ? store.filter((el) => el.id !== id) : store
    )
    .on(getApplicationsFx.failData, () => [])
    .reset(resetApplicationsListEvent);

const $application = createStore<IRecyclableApplication | null>(null)
    .on(getApplicationFx.doneData, (_, data) => data)
    .on(updateApplicationFx.doneData, (_, data) => data)
    .on(updateIsFavoriteApplicationFx.doneData, (store, data) => {
        if (store) {
            const newDate = {...store, isFavorite: data.isFavorite};
            return newDate;
        }
        return data;
    });

sample({
    clock: updateApplicationEvent,
    target: updateApplicationFx,
});

sample({
    clock: updateApplicationFx.doneData,
    target: notificationModel.showAlert.prepend(() => ({
        title: 'Успешно',
        message: 'Изменения сохранены'
    }))
});


sample({
    //@ts-ignore
    clock: gate.open,
    target: getApplicationsFx
})

sample({
    //@ts-ignore
    clock: allApplicationsGate.open,
    target: getAllApplicationsFx
})


export {
    $application,
    $applications,
    getApplicationsFx,
    getApplicationFx,
    updateApplicationEvent,
    updateIsFavoriteApplicationFx,
    deleteApplicationFx,
    applicationsLoading,
    resetApplicationsListEvent,
    updateApplicationFx,
    gate,
    pagination,
    getAllApplicationsFx,
    $allApplicationsWithoutPages,
    allApplicationsGate,
};
