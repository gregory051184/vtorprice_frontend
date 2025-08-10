import {
    createEffect, createEvent, createStore, sample
} from 'effector';
import {AxiosError} from 'axios/index';
import {createLoaderStore} from '@box/shared/lib/helpers';
import {companyVerificationApi} from '../api';
import {ICompanyVerification} from './types';
import {getEquipmentApplicationsFx} from "@box/entities/application/model";


const getCompanyVerificationFx = createEffect<
    Parameters<typeof companyVerificationApi.getCompanyVerification>[0],
    ICompanyVerification, AxiosError>({
    handler: async (id) => {
        const {data} = await companyVerificationApi.getCompanyVerification(id);
        const wrong_data: any = data
        data.employee['first_name'] = wrong_data.employee['firstName']
        data.employee['last_name'] = wrong_data.employee['lastName']
        data.employee['middle_name'] = wrong_data.employee['middleName']
        return data;
    }
});
const getCompaniesVerificationsFx = createEffect<
    Parameters<typeof companyVerificationApi.getCompaniesVerifications>[0]
    , {
    data: Awaited<ReturnType<typeof companyVerificationApi.getCompaniesVerifications>>['data'],
    page?: number
}, AxiosError>({
    handler: async (params) => {
        const {data} = await companyVerificationApi.getCompaniesVerifications(params);

        return {
            data,
            page: params.page,
            count: data.results.length
        };
    }
});

const updateCompanyVerificationEvent = createEvent<
    Parameters<typeof companyVerificationApi.setCompanyVerification>[0]>();

const updateCompanyVerificationFx = createEffect<
    Parameters<typeof companyVerificationApi.setCompanyVerification>[0]
    , ICompanyVerification, AxiosError>({
    handler: async (params) => {
        const {data} = await companyVerificationApi.setCompanyVerification(params);

        return data;
    }
});

sample({
    source: updateCompanyVerificationEvent,
    target: updateCompanyVerificationFx
});

const companiesVerificationsLoading = createLoaderStore(false, getCompaniesVerificationsFx);

const $verificationsCompaniesNumber = createStore<number>(0)
    .on(
        getCompaniesVerificationsFx.doneData, (_, data) => {
            return data.data.count
        }
    )

const $companiesVerifications = createStore<Array<ICompanyVerification>>([])
    .on(getCompaniesVerificationsFx.doneData, (state, data) => {
        if (data.page && data.page > 1) {
            return [
                ...state,
                ...data.data.results,
            ];
        }
        return data.data.results;
    })
    .on(updateCompanyVerificationFx.doneData, (state, data) => {
        const newState = [...state];
        const updatedApplicationIndex = newState.findIndex((el) => el.id === data.id);
        if (updatedApplicationIndex) {
            newState[updatedApplicationIndex] = data;
        }
        return newState;
    });

const $companyVerification = createStore<ICompanyVerification | null>(null)
    .on(getCompanyVerificationFx.doneData, (_, data) => data)
    .on(updateCompanyVerificationFx.doneData, (_, data) => data);

export {
    $companyVerification,
    $companiesVerifications,
    updateCompanyVerificationEvent,
    getCompanyVerificationFx,
    getCompaniesVerificationsFx,
    companiesVerificationsLoading,
    $verificationsCompaniesNumber
};