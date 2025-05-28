import {
    createEffect, createEvent, createStore, sample
} from 'effector';
import {AxiosError} from 'axios';
import {createLoaderStore} from '@box/shared/lib/helpers';
import {companyApi} from '../api';
import {ICompany} from './types';
import {notAuthAlertModel} from '@box/entities/notAuthAlert/model';

const getCompaniesFx = createEffect<
    Parameters<typeof companyApi.getCompanies>[0]
    , {
    data: Awaited<ReturnType<typeof companyApi.getCompanies>>['data'],
    page?: number
}, AxiosError>({
    handler: async (params) => {
        const {data} = await companyApi.getCompanies(params);
        if (params?.rate) {
            //@ts-ignore
            const results = data.results.filter(item => item?.averageReviewRate >= +params?.rate)
            data.results = results
        }
        return {
            data,
            page: params.page
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

export {
    $companies,
    updateCompanyEvent,
    getCompaniesFx,
    companiesLoading,
    updateCompanyInFavoriteEvent,
    updateCompanyInFavoriteFx
};
