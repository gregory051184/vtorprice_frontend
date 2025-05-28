import {
    createEffect, createStore
} from 'effector';
import {AxiosError} from 'axios/index';

import {IDealsStatsData} from './types';
import {dealsStatsApi} from '../../api/DealsStatsApi';


const getDealsStatsFx = createEffect<
    Parameters<typeof dealsStatsApi.getDealsStats>[0]
    , {
    data: Awaited<ReturnType<typeof dealsStatsApi.getDealsStats>>['data'],
}, AxiosError>({
    handler: async (params) => {
        const {data} = await dealsStatsApi.getDealsStats(params);
        return {
            data,
        };
    }
});

// @ts-ignore
// eslint-disable-next-line
const $dealsStats = createStore<IDealsStatsData>(null)
    .on(getDealsStatsFx.doneData, (_, data) => {
        return data.data;
    })

export {
    getDealsStatsFx,
    $dealsStats
};