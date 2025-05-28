import { AxiosResponse } from 'axios/index';
import { $host } from '@box/shared/api';
import { Paginationable } from '@types';
import { IRecycablePrice } from '../recycablesPrices/model/types';


type GetRecycablesPricesParams = {
    category: string,
    applications__city: string,
    applications__urgency_type: string,
    category__parent: number
    page: number,

    period: string
};

class RecycablesPricesApi {
    getCompaniesVerifications(params: Partial<GetRecycablesPricesParams>):
    Promise<AxiosResponse<{
        results: Array<IRecycablePrice>
    } & Paginationable>> {
        return $host.get('/statistics/recyclables_price/', {
            params
        });
    }
}

export const recycablesPricesApi = new RecycablesPricesApi();