import { AxiosResponse } from 'axios/index';
import { $host } from '@box/shared/api';
import { IAveragePriceResult } from '../averagePrice/model/types';

type GetAveragePriceParams = {
    shipping_city: string,
    delivery_city: string,
};

class AveragePriceApi {
    getAveragePrice(params: Partial<GetAveragePriceParams>):
    Promise<AxiosResponse<{
        results: IAveragePriceResult
    }>> {
        return $host.get('/analytics/average_price/', {
            params
        });
    }
}

export const averagePriceApi = new AveragePriceApi();