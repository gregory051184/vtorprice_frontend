import { AxiosResponse } from 'axios/index';
import { $host } from '@box/shared/api';
import { IApproximatePriceResult } from '../model/types';

type GetApproximatePriceParams = {
    delivery_city_pk: number,
    shipping_city_pk: number,
};

class ApproximatePriceApi {
    getApproximatePrice(params: Partial<GetApproximatePriceParams>):
    Promise<AxiosResponse<{
        results: IApproximatePriceResult
    }>> {
        return $host.get('/services/approximate_price_using_cities', {
            params
        });
    }
}

export const approximatePriceApi = new ApproximatePriceApi();