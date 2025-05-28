import {
    createEffect, createStore, sample
} from 'effector';
import {AxiosError} from 'axios/index';
import {createLoaderStore} from '@box/shared/lib/helpers';
import {IRecyclableApplicationPrice, IShortRecyclableApplicationPrice} from './types';
import {recyclablesApplicationsPricesApi} from "@box/entities/statistics/api/RecyclablesApplicationsPricesApi";
import {createGate} from "effector-react";


const gate = createGate();

const shortGate = createGate();

const getRecyclablesApplicationsPricesFx = createEffect<
    Parameters<typeof recyclablesApplicationsPricesApi.getCompaniesVerifications>[0]
    , {
    data: Awaited<ReturnType<typeof recyclablesApplicationsPricesApi.getCompaniesVerifications>>['data'],
    page?: number,

}, AxiosError>({
    handler: async (params) => {
        const {data} = await recyclablesApplicationsPricesApi.getCompaniesVerifications(params);
        return {
            data,
            page: params.page,
        };
    }
});



const getShortRecyclablesApplicationsPricesFx = createEffect<
    Parameters<typeof recyclablesApplicationsPricesApi.getShortRecyclableApplicationsPrice>[0]
    , {
    data: Awaited<ReturnType<typeof recyclablesApplicationsPricesApi.getShortRecyclableApplicationsPrice>>['data'],
    page?: number,

}, AxiosError>({
    handler: async (params) => {
        const {data} = await recyclablesApplicationsPricesApi.getShortRecyclableApplicationsPrice(params);
        return {
            data,
            page: params.page,
        };
    }
});


const recyclablesApplicationsPricesLoading = createLoaderStore(false, getRecyclablesApplicationsPricesFx);


// @ts-ignore
// eslint-disable-next-line
const $recyclablesApplicationsPrices = createStore<Array<IRecyclableApplicationPrice>>([])
    .on(getRecyclablesApplicationsPricesFx.doneData, (state, data) => {
        if (data.page && data.page > 1) {
            return [
                ...state,
                // @ts-ignore
                ...data.data,
            ];
        }
        return data.data;
    })

// @ts-ignore
// eslint-disable-next-line
const $shortRecyclablesApplicationsPrices= createStore<Array<IShortRecyclableApplicationPrice>>([])
    .on(getShortRecyclablesApplicationsPricesFx.doneData, (state, data) => {
        if (data.page && data.page > 1) {
            return [
                ...state,
                // @ts-ignore
                ...data.data,
            ];
        }
        return data.data
    })



sample({
    //@ts-ignore
    clock: gate.open,
    target: getRecyclablesApplicationsPricesFx
})

sample({
    //@ts-ignore
    clock: shortGate.open,
    target: getShortRecyclablesApplicationsPricesFx
})


export {
    getRecyclablesApplicationsPricesFx,
    recyclablesApplicationsPricesLoading,
    $recyclablesApplicationsPrices,
    gate,
    shortGate,
    $shortRecyclablesApplicationsPrices,
};

