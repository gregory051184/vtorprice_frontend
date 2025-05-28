import {
    createEffect, createStore
} from 'effector';
import {AxiosError} from 'axios/index';

import {IApplicationsStatsData} from './types';
import {applicationsStatsApi} from '../../api/ApplicationsStatsApi';


const getApplicationsStatsFx = createEffect<
    Parameters<typeof applicationsStatsApi.getApplicationsStats>[0]
    , {
    data: Awaited<ReturnType<typeof applicationsStatsApi.getApplicationsStats>>['data'],
}, AxiosError>({
    handler: async (params) => {
        const {data} = await applicationsStatsApi.getApplicationsStats(params);
        return {
            data,
        };
    }
});

// @ts-ignore
// eslint-disable-next-line
const $applicationsStats = createStore<IApplicationsStatsData>(null)
    .on(getApplicationsStatsFx.doneData, (_, data) => {
        return data.data;
    })

export {
    getApplicationsStatsFx,
    $applicationsStats
};