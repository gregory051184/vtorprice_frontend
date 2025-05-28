import { AxiosResponse } from 'axios/index';
import { $host } from '@box/shared/api';
import { IRecyclableVolume } from '../recyclablesVolumeStats/model/types';

type GetRecyclablesVolumeStatsParams = {
    deal_type: string,
    urgency_type: string,
    recyclables__category: string,
    city: string,
    period: string
};

class RecyclablesVolumeStatsApi {
    getRecyclablesVolumeStats(params: Partial<GetRecyclablesVolumeStatsParams>):
    Promise<AxiosResponse<{
        results: Array<IRecyclableVolume>
    }>> {
        return $host.get('/statistics/recyclables_volume/', {
            params
        });
    }
}

export const recyclablesVolumeStatsApi = new RecyclablesVolumeStatsApi();