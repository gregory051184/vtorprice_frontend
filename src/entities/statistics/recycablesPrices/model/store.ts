import {
    createEffect, createStore
} from 'effector';
import {AxiosError} from 'axios/index';
import {createLoaderStore} from '@box/shared/lib/helpers';
import {recycablesPricesApi} from '../../api';
import {IRecycablePrice} from './types';


const getRecycablesPricesFx = createEffect<
    Parameters<typeof recycablesPricesApi.getCompaniesVerifications>[0]
    , {
    data: Awaited<ReturnType<typeof recycablesPricesApi.getCompaniesVerifications>>['data'],
    page?: number
}, AxiosError>({
    handler: async (params) => {
        const {data} = await recycablesPricesApi.getCompaniesVerifications(params);
        return {
            data,
            page: params.page
        };
    }
});

const recycablesPricesLoading = createLoaderStore(false, getRecycablesPricesFx);

// @ts-ignore
// eslint-disable-next-line
const $recycablesPrices = createStore<Array<IRecycablePrice>>([])
    .on(getRecycablesPricesFx.doneData, (state, data) => {
        if (data.page && data.page > 1) {
            return [
                ...state,
                // @ts-ignore
                ...data.data,
            ];
        }
        return data.data;
    })

export {
    getRecycablesPricesFx,
    recycablesPricesLoading,
    $recycablesPrices
};

