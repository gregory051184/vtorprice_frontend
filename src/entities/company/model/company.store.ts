import {
    createEffect, createEvent, createStore, sample
} from 'effector';
import {AxiosError} from 'axios';
import {createLoaderStore} from '@box/shared/lib/helpers';
import {companyApi} from '../api';
import {ICompany} from './types';
import {notAuthAlertModel} from '@box/entities/notAuthAlert/model';
import Router from "next/router";
import {$authStore} from "@box/entities/auth";
import {ROLE} from "@types";

const getCompaniesFx = createEffect<
    Parameters<typeof companyApi.getCompanies>[0]
    , {
    data: Awaited<ReturnType<typeof companyApi.getCompanies>>['data'],
    page?: number,
    ordering?: string | null
}, AxiosError>({
    handler: async (params) => {
        const auth = $authStore.getState()

        if (Router.asPath === "/companies") {
            params["recyclables_applications__urgency_type"] = 2
            const {data} = await companyApi.getCompanies(params);
            return {
                data,
                page: params.page,
                ordering: params.ordering,
                count: data.results.length
            };
        }

        if (Router.asPath === "/companies-verification" && auth.user?.role?.id === ROLE.MANAGER) {
            params['manager'] = auth.user?.id
            const {data} = await companyApi.getCompanies(params);
            if (params?.rate) {
                //@ts-ignore
                const results = data.results.filter(item => item?.averageReviewRate >= +params?.rate)
                data.results = results
            }
            return {
                data,
                page: params.page,
                ordering: params.ordering,
                count: data.results.length
            };
        }
        const {data} = await companyApi.getCompanies(params);
        if (params?.rate) {
            //@ts-ignore
            const results = data.results.filter(item => item?.averageReviewRate >= +params?.rate)
            data.results = results
        }
        data.results = Router.asPath === "/companies-verification" ? data.results : data.results.filter(company => !company.isDeleted)
        return {
            data,
            page: params.page,
            count: data.results.length,
            ordering: params.ordering,
        };
    }
});

const updateCompanyEvent = createEvent<Parameters<typeof companyApi.setCompany>[0]>();

const updateCompanyFx = createEffect<
    Parameters<typeof companyApi.setCompany>[0]
    , ICompany, AxiosError>({
    handler: async (params) => {
        const {data} = await companyApi.setCompany(params);

        return data;
    }
});

sample({
    source: updateCompanyEvent,
    target: updateCompanyFx
});

const updateCompanyInFavoriteEvent = createEvent<
    Parameters<typeof companyApi.updataCompanyInFavorite>[0]>();

const updateCompanyInFavoriteFx = createEffect<
    Parameters<typeof companyApi.updataCompanyInFavorite>[0], ICompany, AxiosError>({
    handler: async (params) => {
        const {data} = await companyApi.updataCompanyInFavorite(params);
        return data;
    }
});

sample({
    clock: updateCompanyInFavoriteEvent,
    target: updateCompanyInFavoriteFx
});

sample({
    clock: updateCompanyInFavoriteEvent,
    target: notAuthAlertModel.openModalNotAuthEvent
});

const companiesLoading = createLoaderStore(false, getCompaniesFx);

const $companies = createStore<Array<ICompany>>([])
    .on(getCompaniesFx.doneData, (state, data) => {
        if (data.page && data.page > 1) {

            // const res = data.data.results.map((item: any) => item.id)
            // const st = state.map((item: any) => item.id)
            // let difference = res
            //     .filter(x => !st.includes(x))
            // let final = data.data.results.filter((item: any) => difference.includes(item.id))
            // for (let i = 0; i < final.length; i++) {
            //     state.push(final[i])
            // }
            // if (data.ordering === 'status') {
            //     const correct_state = state.map((item: any) => {
            //         if (!item.status) {
            //             item.status.id = 0;
            //         }
            //         return item
            //     })
            //     correct_state.sort(function (a, b) {
            //         //@ts-ignore
            //         return a.status.id - b.status.id;
            //     });
            //     return correct_state
            // }
            // if (data.ordering === '-status') {
            //     const correct_state = state.map((item: any) => {
            //         if (!item.status) {
            //             item.status.id = 0;
            //         }
            //         return item
            //     })
            //     correct_state.sort(function (a, b) {
            //         //@ts-ignore
            //         return a.status.id - b.status.id;
            //     });
            //     return correct_state
            // }
            //
            // if (data.ordering === 'recyclables_count') {
            //     const correct_state = state.map((item: any) => {
            //         if (!item.recyclablesCount) {
            //             item.recyclablesCount = 0;
            //         }
            //         return item
            //     })
            //     correct_state.sort(function (a, b) {
            //         //@ts-ignore
            //         return a.recyclablesCount - b.recyclablesCount;
            //     });
            //     return correct_state
            // }
            // if (data.ordering === '-recyclables_count') {
            //     const correct_state = state.map((item: any) => {
            //         if (!item.recyclablesCount) {
            //             item.recyclablesCount = 0;
            //         }
            //         return item
            //     })
            //     correct_state.sort(function (a, b) {
            //         //@ts-ignore
            //         return b.recyclablesCount - a.recyclablesCount;
            //     });
            //     return correct_state
            // }
            //
            // return state

            return [
                ...state,
                ...data.data.results,
            ];
        }
        return data.data.results;
    })
    .on(updateCompanyFx.doneData, (state, data) => {
        const newState = [...state];
        const updatedApplicationIndex = newState.findIndex((el) => el.id === data.id);
        if (updatedApplicationIndex) {
            newState[updatedApplicationIndex] = data;
        }
        return newState;
    })
    .on(updateCompanyInFavoriteFx.doneData, (state, data) => {
        const newState = [...state];
        const updataApplicationIndex = newState.findIndex((el) => el.id === data.id);
        if (updataApplicationIndex != null) {
            newState[updataApplicationIndex].isFavorite = data.isFavorite;
        }
        return newState;
    });

const $statusCompaniesNumber = createStore<number>(0)
    .on(
        getCompaniesFx.doneData, (_, data) => {
            return data.data.count
        }
    )

export {
    $companies,
    updateCompanyEvent,
    getCompaniesFx,
    companiesLoading,
    updateCompanyInFavoriteEvent,
    updateCompanyInFavoriteFx,
    $statusCompaniesNumber
};
