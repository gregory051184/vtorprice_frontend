import {
    createEffect, createStore
} from 'effector';
import {AxiosError} from 'axios/index';

import {ICompaniesStatsData} from './types';
import {companiesStatsApi} from '../../api/CompaniesStatsApi';


const getCompaniesStatsFx = createEffect<
    Parameters<typeof companiesStatsApi.getCompaniesStats>
    , {
    data: Awaited<ReturnType<typeof companiesStatsApi.getCompaniesStats>>['data'],
}, AxiosError>({
    handler: async () => {
        const {data} = await companiesStatsApi.getCompaniesStats();
        return {
            data,
        };
    }
});

// @ts-ignore
// eslint-disable-next-line
const $companiesStats = createStore<ICompaniesStatsData>(null)
    .on(getCompaniesStatsFx.doneData, (_, data) => {
        return data.data;
    })

export {
    getCompaniesStatsFx,
    $companiesStats
};