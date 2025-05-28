import {
    createEffect, createStore
} from 'effector';
import {AxiosError} from 'axios/index';

import {IRecyclableVolume} from './types';
import {recyclablesVolumeStatsApi} from '../../api/RecyclablesVolumeStatsApi';


const getRecyclablesVolumeStatsFx = createEffect<
    Parameters<typeof recyclablesVolumeStatsApi.getRecyclablesVolumeStats>[0]
    , {
    data: Awaited<ReturnType<typeof recyclablesVolumeStatsApi.getRecyclablesVolumeStats>>['data'],
}, AxiosError>({
    handler: async (params) => {
        const {data} = await recyclablesVolumeStatsApi.getRecyclablesVolumeStats(params);
        return {
            data,
        };
    }
});

// @ts-ignore
// eslint-disable-next-line
const $recyclablesVolumeStats = createStore<Array<IRecyclableVolume>>([])
    .on(getRecyclablesVolumeStatsFx.doneData, (_, data) => {
        return data.data;
    })

export {
    getRecyclablesVolumeStatsFx,
    $recyclablesVolumeStats
};