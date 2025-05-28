import {
    createEffect, createStore, sample
} from 'effector';
import {AxiosError} from 'axios/index';
import {createLoaderStore} from '@box/shared/lib/helpers';
import {IMainPageStatistics} from './types';
import {createGate} from "effector-react";
import {mainPageStatisticsApi} from "@box/entities/statistics/api/MainPageStatistics";

const gate = createGate();

const getRecyclablesApplicationsForMainPageFx = createEffect<
    Parameters<typeof mainPageStatisticsApi.getStatisticsForMainPages>[0]
    , {
    data: Awaited<ReturnType<typeof mainPageStatisticsApi.getStatisticsForMainPages>>['data'],

}, AxiosError>({
    handler: async (params) => {
        const {data} = await mainPageStatisticsApi.getStatisticsForMainPages(params);
        return {
            data
        };
    }
});

const mainPageStatisticsLoading = createLoaderStore(false, getRecyclablesApplicationsForMainPageFx);

// @ts-ignore
// eslint-disable-next-line
const $mainPageStatistics = createStore<Array<IMainPageStatistics>>([])
    .on(getRecyclablesApplicationsForMainPageFx.doneData, (state, data) => {
        return data.data;
    })

sample({
    //@ts-ignore
    clock: gate.open,
    target: getRecyclablesApplicationsForMainPageFx
})

export {
    getRecyclablesApplicationsForMainPageFx,
    mainPageStatisticsLoading,
    $mainPageStatistics,
    gate
};