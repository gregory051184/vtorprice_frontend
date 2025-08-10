import {applicationModel, applicationApi} from '@box/entities/application';
import {companyApi, companyModel} from '@box/entities/company';
import {ICompany} from '@box/entities/company/model';
import {createList} from '@box/shared/lib/factories';
import {AxiosError} from 'axios';
import {createEffect, createStore, sample} from 'effector';
import Router from "next/router";
import {createGate} from "effector-react";

const getCompanyFx = createEffect<number, companyModel.ICompany, AxiosError>({
    handler: async (id) => {
        const {data} = await companyApi.getCompany(id);
        return data;
    }
});


const gate = createGate();

const getApplicationsFx = createEffect<
    Parameters<typeof applicationApi.getApplications>[0]
    , {
    data: Awaited<ReturnType<typeof applicationApi.getApplications>>['data'],
    page?: number
}, AxiosError>({
    handler: async (params) => {
        //Для того чтобы в карточку компании поступали все контракты, а не только 7 шт
        if (/\/companies\/\d/.test(Router.asPath)) {
            params.size = 1000
        }
        const {data} = await applicationApi.getApplications(params);
        return {
            data,
            page: params.page
        };
    }
});

const getCompanyReadyForShipmentApplicationsFx = createEffect<
    Parameters<typeof applicationApi.getCompanyReadyForShipmentApplications>[0]
    , {
    data: Awaited<ReturnType<typeof applicationApi.getCompanyReadyForShipmentApplications>>['data'],
    page?: number
}, AxiosError>({
    handler: async (params) => {
        const companyId = +Router.asPath.split('/')[2];
        params.size = 1000
        params.company = companyId;
        const {data} = await applicationApi.getCompanyReadyForShipmentApplications(params);
        return {
            data,
            page: params.page,
        };
    }
});

const $applicationsCount = createStore(0)
    .on(getApplicationsFx.doneData, (_, applications) => applications.data.count);

const changeInFavoriteFx = createEffect<
    Parameters<typeof companyApi.updataCompanyInFavorite>[0], ICompany, AxiosError>({
    handler: async (params) => {
        const {data} = await companyApi.updataCompanyInFavorite(params);
        return data;
    }
});

const $company = createStore<companyModel.ICompany | null>(null)
    .on(getCompanyFx.doneData, (_, data) => data)
    .on(changeInFavoriteFx.doneData, (_, data) => data)

const $companyReadyForShipmentApplications = createStore<Array<applicationModel.IRecyclableApplication>>([])
    .on(getCompanyReadyForShipmentApplicationsFx.doneData, (state, data) => {
        if (data.page && data.page > 1) {
            return [
                ...state,
                //ДОБАВИЛ ФИЛЬТРЫ
                ...data.data
            ];
        }
        return data.data
    });


const $companyApplications = createStore<Array<applicationModel.IRecyclableApplication>>([])
    .on(getApplicationsFx.doneData, (state, data) => {
        if (data.page && data.page > 1) {
            return [
                ...state,
                //ДОБАВИЛ ФИЛЬТРЫ
                ...data.data.results
            ];
        }
        return data.data.results
    });

const {pagination: applicationsPagination, effect: fetchApplications} = createList({
    effect: getApplicationsFx,
    filters: $company,
    mapFilters: (filters) => ({
        company: filters?.id
    }),
    fetchFilter: $company.map((el) => el !== null)
});

sample({
    //@ts-ignore
    clock: gate.open,
    target: getCompanyReadyForShipmentApplicationsFx
})

export {
    $company,
    getCompanyFx,
    changeInFavoriteFx,
    $companyApplications,
    applicationsPagination,
    $applicationsCount,
    fetchApplications,
    $companyReadyForShipmentApplications,
    gate
};
