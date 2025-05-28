import { AxiosResponse } from 'axios/index';
import { $host } from '@box/shared/api';
import { IApplicationsStatsData } from '../applicationsStats/model/types';

type GetApplicationsStatsParams = {
    deal_type: string,
    urgency_type: string,
    recyclables: string,
    city: string,
    period: string
};

class ApplicationsStatsApi {
    getApplicationsStats(params: Partial<GetApplicationsStatsParams>):
    Promise<AxiosResponse<{
        results: IApplicationsStatsData
    }>> {
        return $host.get('/statistics/total_applications/', {
            params
        });
    }
}

export const applicationsStatsApi = new ApplicationsStatsApi();