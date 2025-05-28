import { AxiosResponse } from 'axios/index';
import { $host } from '@box/shared/api';
import { ILogisticsDealsData } from '../logisticsDeals/model/types';

type GetLogisticsDealsParams = {
    period: string,
    city: string,
    region: string
};

class LogisticsDealsApi {
    getLogisticsDeals(params: Partial<GetLogisticsDealsParams>):
    Promise<AxiosResponse<{
        results: ILogisticsDealsData
    }>> {
        return $host.get('/analytics/logistics_deals_amount/', {
            params
        });
    }
}

export const logisticsDealsApi = new LogisticsDealsApi();