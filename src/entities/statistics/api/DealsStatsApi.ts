import { AxiosResponse } from 'axios/index';
import { $host } from '@box/shared/api';
import { IDealsStatsData } from '../dealsStats/model/types';

type GetDealsStatsParams = {
    application__recyclables: string,
    period: string
};

class DealsStatsApi {
    getDealsStats(params: Partial<GetDealsStatsParams>):
    Promise<AxiosResponse<{
        results: IDealsStatsData
    }>> {
        return $host.get('/statistics/total_deals/', {
            params
        });
    }
}

export const dealsStatsApi = new DealsStatsApi();